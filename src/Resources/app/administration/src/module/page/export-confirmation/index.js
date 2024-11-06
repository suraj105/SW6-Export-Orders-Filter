import './export-confirmation.scss';
import template from './export-confirmation.html.twig';

export default {
    template,

    inject: [
        'repositoryFactory',
        'acl',
    ],

    data() {
        return {
            orders: [], // Array to hold all fetched orders
            filteredOrders: [], // Start with no orders shown
            selectedOrderNumber: "", // Default: placeholder is shown in dropdown
        };
    },

    created() {
        this.loadOrders(); // Fetch orders when the component is created
    },

    computed: {
        orderOptions() {
            // If no order is selected, include the placeholder as the first option
            if (this.selectedOrderNumber === "") {
                return [{ orderNumber: "", placeholder: true, label: "Please select an order" }, ...this.orders];
            }
            return this.orders;
        },

        csvPreview() {
            // Define CSV header
            let csvContent = "id;order_number;sales_channel_id;customer_firstname;customer_lastname;customer_email;" +
                "billing_address_street;billing_address_zipcode;billing_address_city;billing_address_company;billing_address_department;" +
                "billing_address_country_id;billing_address_country_state_id;shipping_address_street;shipping_address_zipcode;" +
                "shipping_address_city;shipping_address_company;shipping_address_department;shipping_address_country_id;" +
                "billing_address_country_state_id;amount_total;order_state_id;line_items;order_date_time;payment_method;payment_method_id\n";

            // Populate CSV with filtered order data
            csvContent += this.orders.map(order => {
                const billingAddress = order.addresses.find(addr => addr.type === 'billing') || {};
                const shippingAddress = order.addresses.find(addr => addr.type === 'shipping') || {};
                const lineItems = this.getLineItems(order);

                return `${order.id};${order.orderNumber};${order.salesChannelId};${order.orderCustomer.firstName};${order.orderCustomer.lastName};${order.orderCustomer.email};` +
                    `${billingAddress.street || ''};${billingAddress.zipcode || ''};${billingAddress.city || ''};${billingAddress.company || ''};${billingAddress.department || ''};` +
                    `${billingAddress.countryId || ''};${billingAddress.countryStateId || ''};${shippingAddress.street || ''};${shippingAddress.zipcode || ''};` +
                    `${shippingAddress.city || ''};${shippingAddress.company || ''};${shippingAddress.department || ''};${shippingAddress.countryId || ''};${shippingAddress.countryStateId || ''};` +
                    `${order.amountTotal};${order.stateId};"${lineItems}";${order.orderDateTime};"";""`;
            }).join('\n');

            return csvContent;
        }
    },

    methods: {
        async loadOrders() {
            const orderRepository = this.repositoryFactory.create('order');
            const criteria = new Shopware.Data.Criteria();
            criteria.setLimit(10); // Adjust limit as necessary
            criteria.addSorting(Shopware.Data.Criteria.sort('orderDateTime', 'DESC')); // Sort by order date in descending order
            criteria.addAssociation('lineItems'); // To get line items associated with each order
            criteria.addAssociation('addresses'); // To get addresses (billing and shipping)

            try {
                const orders = await orderRepository.search(criteria, Shopware.Context.api);
                this.orders = orders;
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        },

        formatOrderDateTime(dateTime) {
            const date = new Date(dateTime);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            // Return formatted string as "YYYY-MM-DD - HH-MM-SS"
            return `${year}-${month}-${day} - ${hours}-${minutes}-${seconds}`;
        },

        getLineItems(order) {
            // Format line items as "quantity x item_id"
            return order.lineItems.map(item => `${item.quantity}x ${item.id}`).join(', ');
        },

        filterOrders() {
            if (this.selectedOrderNumber) {
                // Find the selected order based on order number
                const selectedOrder = this.orders.find(order => order.orderNumber === this.selectedOrderNumber);

                // Check if the selected order was found
                if (selectedOrder) {
                    // Filter orders to include only those with the same or a later date and time
                    this.filteredOrders = this.orders.filter(order => new Date(order.orderDateTime) >= new Date(selectedOrder.orderDateTime));
                }
            } else {
                // If no order is selected, show no orders
                this.filteredOrders = [];
            }
        },

        downloadCsv() {
            const csvContent = this.csvPreview;
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'exported_orders.csv'; // Set filename to exported_orders.csv without date
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }

    }
};
