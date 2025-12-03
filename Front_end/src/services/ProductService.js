class ProductService {
    constructor(){
        // base API (without repeating /products)
        this.apiURL = 'http://localhost:5000/api';
    }

    async getProducts() {
        try {
            const response = await fetch(`${this.apiURL}/products`);
            if(!response.ok){
                throw new Error('Lỗi không tải được sản phẩm');
            }

            const data = await response.json();

            // Normalize items to the frontend shape
            const products = Array.isArray(data)
                ? data.map(item => this.normalizeProduct(item))
                : [];

            return {
                success: true,
                data: products
            };
        }
        catch (error) {
            console.error('Lỗi khi lấy sản phẩm:', error);
            return {
                success: false,
                message: error.message,
                data: []
            };
        }
    }

    async getProductById(id) {
        try {
            if (!id) {
                throw new Error('Missing product id');
            }

            const response = await fetch(`${this.apiURL}/products/${id}`);
            if (!response.ok) {
                throw new Error('Lỗi không lấy được sản phẩm theo id');
            }

            const data = await response.json();
            const product = this.normalizeProduct(data);

            return {
                success: true,
                data: product
            };
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm theo id:', error);
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }

    normalizeProduct(apiProduct = {}) {
        const id = apiProduct._id || apiProduct.id || apiProduct.productId || null;
        const name = apiProduct.name || apiProduct.title || 'Sản phẩm';
        const image = apiProduct.image || apiProduct.imageUrl || apiProduct.img || '';
        const ram = apiProduct.ram || 'N/A';
        const storage = apiProduct.storage || 'N/A';
        const screen = apiProduct.screen || apiProduct.display || 'N/A';

        // Prefer explicit currentPrice, fall back to price (number) and format it
        let priceVal = apiProduct.currentPrice ?? apiProduct.price ?? apiProduct.cost ?? 0;

        const currentPrice = (typeof priceVal === 'number')
            ? this.formatPrice(priceVal)
            : String(priceVal || '0₫');

        const oldPriceVal = apiProduct.oldPrice ?? apiProduct.listPrice ?? null;
        const oldPrice = oldPriceVal
            ? (typeof oldPriceVal === 'number' ? this.formatPrice(oldPriceVal) : String(oldPriceVal))
            : null;

        return {
            id,
            name,
            image,
            ram,
            storage,
            screen,
            currentPrice,
            oldPrice
        };
    }

    formatPrice(price) {
        // Accept numbers; if string provided leave as-is
        const numeric = typeof price === 'number' ? price : parseInt(String(price).replace(/[₫,\.\s]/g, '')) || 0;
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(numeric);
    }
}

const productService = new ProductService();
export default productService;