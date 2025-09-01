const CartService = require('../services/cart.service');

class CartController {
    async addToCart(req, res) {
        try {
            const { userId, productId, sizeId, quantity } = req.body;

            if (!userId || !productId || !quantity) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const result = await CartService.addToCart(userId, productId, sizeId, quantity);
            res.status(200).json({ message: 'Product added to cart', cartItem: result });
        } catch (err) {
            console.error('❌ Error in addToCart:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getCart(req, res) {
        try {
            const userId = req.params.userId;

            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }

            const cart = await CartService.getCartByUserId(userId);
            res.status(200).json({
                message: 'Lấy giỏ hàng thành công',
                cart
            });
        } catch (err) {
            console.error('❌ Error in getCart:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async updateQuantity(req, res) {
        try {
            const { cartItemId, quantity } = req.body;

            if (!cartItemId || quantity == null) {
                return res.status(400).json({ message: 'Missing cartItemId or quantity' });
            }

            await CartService.updateQuantity(cartItemId, quantity);
            res.status(200).json({ message: 'Quantity updated' });
        } catch (err) {
            console.error('❌ Error in updateQuantity:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async removeItem(req, res) {
        try {
            const { cartItemId } = req.body;

            if (!cartItemId) {
                return res.status(400).json({ message: 'Missing cartItemId' });
            }

            await CartService.removeItem(cartItemId);
            res.status(200).json({ message: 'Item removed from cart' });
        } catch (err) {
            console.error('❌ Error in removeItem:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = new CartController();
