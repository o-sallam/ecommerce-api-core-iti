const express=require('express');
const router=express.Router();
const productController=require('../controllers/products.controller');

router.post('/bulk', productController.addBulkProducts);
router.post('/',productController.createProduct);
router.get('/',productController.getAllProducts);
router.get('/:id',productController.getSingleProduct);
router.put('/:id',productController.updateProduct);
router.delete('/:id',productController.deleteProduct);


module.exports=router;