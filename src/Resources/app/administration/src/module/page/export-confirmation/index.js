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
            orders: [
                {
                    orderNumber: "1", // Hardcoded order number
                    orderCustomer: {
                        firstName: "Mike"
                    },
                    billingAddress: {}, // Empty placeholder for billing address
                    deliveries: [], // Empty placeholder for deliveries
                    lineItems: [], // Empty placeholder for line items
                    orderDateTime: "2024-11-01T10:00:00Z", // Sample date-time
                },
                {
                    orderNumber: "2",
                    orderCustomer: {
                        firstName: "Anna"
                    },
                    billingAddress: {},
                    deliveries: [],
                    lineItems: [],
                    orderDateTime: "2024-11-02T12:30:00Z", // Sample date-time
                },
                {
                    orderNumber: "3",
                    orderCustomer: {
                        firstName: "John"
                    },
                    billingAddress: {},
                    deliveries: [],
                    lineItems: [],
                    orderDateTime: "2024-11-03T15:45:00Z", // Sample date-time
                }
            ],
            filteredOrders: [], // Start with no orders shown
            selectedOrderNumber: "", // Default: placeholder is shown in dropdown
        };
    },

    created() {
        this.loadOrders(); // Load hardcoded orders when the component is created
    },

    computed: {
        orderOptions() {
            // Include a placeholder as the first option if no order is selected
            if (this.selectedOrderNumber === "") {
                return [{ orderNumber: "", placeholder: true, label: "Please select an order" }, ...this.orders];
            }
            return this.orders;
        },

        csvPreview() {
            // Define CSV header in the specified format
            let csvContent = "order_number;customer_firstname\n"; // Simplified CSV header

            // Generate each row according to the header, using only hardcoded fields
            csvContent += this.orders.map(order => {
                return `${order.orderNumber || ''};${order.orderCustomer.firstName || ''}`;
            }).join('\n');

            return csvContent;
        }
    },

    methods: {
        loadOrders() {
            // Use hardcoded orders directly without repository fetch
            this.filteredOrders = this.orders;
            console.log('Using hardcoded orders:', this.orders);
        },

        downloadCsv() {
            const csvContent = this.csvPreview;
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `exported_orders_test.csv`; // Static filename for testing
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }
};
