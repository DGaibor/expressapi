const express = require('express');
const { PrismaClient } = require('./generated/prisma')

const prisma = new PrismaClient()

const app = express()
app.use(express.json());

const port = 3000;

app.post('/products', async (req, res) => {

    await prisma.product.create({
        data: {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        }
    })
    res.status(201).send({
        message: 'Product created successfully'
    })
})

app.get('/products',  async (req, res) => {
    
    const {nameQuery, priceQuery} = req.query
 
    const filters= [];
    
    if (nameQuery){
        filters.push({name: nameQuery})
    }
    if (parseFloat(priceQuery)){
        filters.push({price: parseFloat(priceQuery)})
    }


    try{
        let products = await prisma.product.findMany({
            where: filters.length > 0 ? { OR: filters } : undefined
        })
        res.status(200).json({
            message: 'List of products',
            products: products
        })
    }catch (e) {
       res.status(500).json({
        message: 'Error retrieving products',
        error: e.message
       }) 
    }
    
    
    
})



app.listen(port)
    
