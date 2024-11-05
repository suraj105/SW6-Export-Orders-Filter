import './export-test.scss';
import template from './export-test.html.twig';

export default {
    template,

    inject: [
        'repositoryFactory',
        'acl',
    ],

    data() {
    },

    created() {
    },


    methods: {
        startExport() {
            console.log('Starting export with selected order:', this.selectedOrder);
            this.$router.push({ path: 'confirmation' });
        },
    },
};
