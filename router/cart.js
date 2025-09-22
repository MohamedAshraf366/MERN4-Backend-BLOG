let mongoose = require('mongoose')
let express = require('express')
let router = express.Router()
let Cart = require('../models/CartSchema')
let Menu = require('../models/menuSchema')

// 1- to add menu food to category
router.post('/:userId', async(req, resp)=>{
    try{
        let{userId} = req.params
        let{menu, qty} = req.body
        let cart = await Cart.findOne({user:userId})
        if(!cart){
            cart = new Cart({
                user:userId,
                items:[{menu:menu, qty:qty || 1}]
            })
        }
        else {
            //check if item in the cart
            //i.menu from mongodb can't be compared with menu that is string
            let itemIndex = cart.items.findIndex((i)=>i.menu.toString() === menu)
            if(itemIndex > -1){
                cart.items[itemIndex].qty += qty;
            } else {
                cart.items.push({ menu, qty });
            }

            // cart.items = cart.items.reduce((acc, item) => {
            //     let existing = acc.find(i => i.menu.toString() === item.menu.toString());
            //     if(existing){
            //         existing.qty = item.qty; 
            //     } else {
            //         acc.push(item);
            //     }
            //     return acc;
            // }, []);
                    
         
    }
        await cart.save()
        resp.status(200).json({status:'success', data:cart})
    }
    catch(error){
        resp.status(400).json({status:'error', data:error})
    }
})

// 2- to get items in cart
router.get('/:userId', async(req, resp)=>{
    try{
        let {userId} = req.params
        let cart = await Cart.findOne({user:userId}).populate('items.menu')
        //populate is only working for objectId refernce which is menu Id
        if(!cart){
        return resp.status(400).json({status:'fail', data:{items:[], qty:0}})
        }
        let total = 0
        await cart.populate('items.menu')
        cart.items.forEach((i)=>{
            total +=i.menu.price * i.qty //the price of items in menu food
        })

        resp.status(200).json({status:'success', data:{cart, total}})
    }
    catch(error){
        resp.status(400).json({status:'error', data:error})
    }
})

// 3- to update and modify
router.patch('/updateCart', async(req, resp)=>{
    try{
        let{userId, menu, qty} = req.body
        let cart = await Cart.findOne({user:userId})
        if(!cart){
            return resp.status(400).json({status:'fail', data:'Cart not found'})
        }
        let itemIndex = cart.items.findIndex((i)=>i.menu.toString() === menu)
            if(itemIndex > -1){
                if(qty > 0){
                    cart.items[itemIndex].qty = qty
                }
                else{
                    cart.items.splice(itemIndex,1)
                }
                
                await cart.save()
                let total = 0
                await cart.populate('items.menu')
                cart.items.forEach((i)=>{
                    total +=i.menu.price * i.qty
                })
                resp.status(200).json({status:'success', data:{cart, total}})
            }
            else{
                return resp.status(404).json({status:'fail', data:'item not found on cart'})
            }
        
    }
    catch(error){
        resp.status(400).json({status:'error', data:error})
    }
})

//4- to delete item from cart
router.delete('/remove', async(req, resp)=>{
    try{
        let{userId, menu} = req.body
        let cart = await Cart.findOne({user:userId})
        if(!cart){
            return resp.status(404).json({ status:'fail', data:'Cart not found' });
        }
        cart.items = cart.items.filter((i)=>i.menu.toString() !== menu)
        await cart.save()
        let total = 0
        await cart.populate('items.menu')
        cart.items.forEach((i)=>{
            total += i.menu.price * i.qty
        })
        resp.status(200).json({status:'success', data:{cart, total}})

    }
      catch(error){
        resp.status(400).json({status:'error', data:error})
    }
    
})

//5- to delete all items and make cart empty
router.delete('/remove/:userId', async(req, resp)=>{
    try{
        let {userId} = req.params
        let cart = await Cart.findOne({user:userId})
        if(!cart){
            return resp.status(404).json({ status:'fail', data:'Cart not found' });
        }
        cart.items = []
        await cart.save()
        resp.status(200).json({status:'success', data:cart})

        }
        catch(error){
            resp.status(400).json({status:'error', data:error})
        }
    
})

module.exports = router