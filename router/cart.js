let express = require('express')
let router = express.Router()
let Cart = require('../models/CartSchema')
const { cookieAuth } = require('../auth/middleware')
const Book = require('../models/BookSchema')

// Add to cart
router.post('/addToCart', cookieAuth(), async (req, resp) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id })
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] })
            await cart.save()
        }

        let { bookId } = req.body
        if (!bookId) {
            return resp.status(400).json({ status: 'error', message: 'Book ID is required' })
        }

        let book = await Book.findById(bookId)
        if (!book) {
            return resp.status(404).json({ status: 'error', message: 'Book not found' })
        }

        if (book.stock <= 0) {
            return resp.status(405).json({ status: 'error', message: 'Out of stock' })
        }

        let itemIndex = cart.items.findIndex(item => item.book.toString() === bookId)
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += 1
        } else {
            cart.items.push({ book: bookId, price: book.price, quantity: 1 })
        }

        book.stock -= 1
        await book.save()
        await cart.save()
        await cart.populate('items.book')

        resp.status(200).json({ status: 'success', data: cart })
    } catch (error) {
        resp.status(500).json({ status: 'error', message: error.message })
    }
})

// Get cart
router.get('/', cookieAuth(), async (req, resp) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id })
         .populate({
        path: 'items.book',
        populate: {
          path: 'category',
          select: 'name' 
        }
      });
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] })
            await cart.save()
        }
        resp.status(200).json({ status: 'success', data: cart })
    } catch (error) {
        resp.status(500).json({ status: 'error', message: error.message })
    }
})

// Update cart
// Update cart
router.patch('/update', cookieAuth(), async (req, resp) => {
    try {
        let { bookId, quantity } = req.body
        let cart = await Cart.findOne({ user: req.user.id }).populate('items.book')
        if (!cart) {
            return resp.status(404).json({ status: 'fail', data: 'Cart not found' })
        }

        let item = cart.items.find(it => it.book._id.toString() === bookId)
        if (!item) {
            return resp.status(404).json({ status: 'fail', data: 'Item not found in cart' })
        }

        let book = await Book.findById(bookId)
        if (!book) {
            return resp.status(404).json({ status: 'fail', data: 'Book not found' })
        }

        // فرق الكمية الجديدة والقديمة
        let difference = quantity - item.quantity

        if (difference > 0) {
            // بيزود في الكمية
            if (book.stock < difference) {
                return resp.status(400).json({ status: 'fail', data: 'Not enough stock' })
            }
            book.stock -= difference
        } else if (difference < 0) {
            // بيقلل في الكمية
            book.stock += Math.abs(difference)
        }

        // تحديث الكمية في الكارت
        item.quantity = quantity

        await book.save()
        await cart.save()

        resp.status(200).json({ status: 'success', data: cart })
    } catch (error) {
        resp.status(500).json({ status: 'error', message: error.message })
    }
})


// Remove from cart
router.delete('/remove/:bookId', cookieAuth(), async (req, resp) => {
    try {
        let {bookId} = req.params
        let cart = await Cart.findOne({ user: req.user.id }).populate('items.book')
        if (!cart) {
            return resp.status(404).json({ status: 'fail', data: 'Cart not found' })
        }

        let itemIndex = cart.items.findIndex(it => it.book._id.toString() === bookId)
        if (itemIndex === -1) {
            return resp.status(404).json({ status: 'fail', data: 'Item not found in cart' })
        }

        let item = cart.items[itemIndex]
        let book = await Book.findById(bookId)
        if (book) {
            book.stock += item.quantity
            await book.save()
        }

        cart.items.splice(itemIndex, 1)
        await cart.save()

        resp.status(200).json({ status: 'success', data: cart })
    } catch (error) {
        resp.status(500).json({ status: 'error', message: error.message })
    }
})

module.exports = router
