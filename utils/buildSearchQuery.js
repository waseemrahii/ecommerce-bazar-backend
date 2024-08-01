

// Utility function for building the search query based on the provided search parameters
export const buildSearchQuery = (searchParams) => {
    const query = {};

    if (searchParams.orderStatus) {
        query.orderStatus = searchParams.orderStatus;
    }

    if (searchParams.customerId) {
        query.customer = searchParams.customerId;
    }

    if (searchParams.vendorId) {
        query.vendor = searchParams.vendorId;
    }

    if (searchParams.productIds && Array.isArray(searchParams.productIds)) {
        query.products = { $in: searchParams.productIds };
    }

    if (searchParams.startDate && searchParams.endDate) {
        query.createdAt = {
            $gte: new Date(searchParams.startDate),
            $lte: new Date(searchParams.endDate)
        };
    }

    if (searchParams.minPrice && searchParams.maxPrice) {
        query.totalPrice = {
            $gte: Number(searchParams.minPrice),
            $lte: Number(searchParams.maxPrice)
        };
    }

    if (searchParams.searchTerm) {
        query.$or = [
            { 'products.name': new RegExp(searchParams.searchTerm, 'i') },
            { 'customer.firstName': new RegExp(searchParams.searchTerm, 'i') },
            { 'customer.lastName': new RegExp(searchParams.searchTerm, 'i') },
            { 'vendor.shopName': new RegExp(searchParams.searchTerm, 'i') }
        ];
    }

    return query;
};