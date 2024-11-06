Shopware.Component.register('export-confirmation', () => import('../page/export-confirmation')); // Register confirmation component

import deDE from '../../snippet/de-DE.json';
import enGB from '../../snippet/en-GB.json';

Shopware.Module.register('export-orders', {
    type: 'plugin',
    name: 'exportOrders',
    title: 'export.administration.menuItem',
    description: 'export.administration.description',
    color: '#ff3d58',
    icon: 'default-shopping-paper-bag-product',

    snippets: {
        'de-DE': deDE,
        'en-GB': enGB
    },

    routes: {
        confirmation: { // New route for confirmation page
            component: 'export-confirmation',
            path: 'export/confirmation'
        }
    },

    navigation: [{
        label: 'export.administration.navItem',
        color: '#ff3d58',
        path: 'export.orders.confirmation',
        icon: 'default-shopping-paper-bag-product',
        parent: 'sw-order',
        position: 100
    }]
});
