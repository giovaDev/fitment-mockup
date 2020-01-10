var router = require('express').Router();
var brandsFile=require('../utils/brandsModelYears')
router.get('/test', function(req, res) {
    res.send('hello test');
});

router.get('/getBrands', function(req, res) {
  console.log('invoked getBrands API');
    res.send(JSON.stringify(separateBrands(brandsFile)));
});


router.all('/getModels/:modelCode', function(req, res) {
  console.log('invoked getModels API');
  let modelCode = req.params['modelCode'];
  let modelsData=getModelsData(brandsFile, modelCode);
  if(modelsData){
    res.send(JSON.stringify(getModelsData(brandsFile, modelCode)));
  }else{
    res.send('error, model not found');
  }
});

function separateBrands( originalFile ){
  let result = JSON.parse(JSON.stringify(originalFile));
  console.log('original file is '+JSON.stringify(result))
  result['brands']=result['brands'].map( (brandData)=>{
    return {
      "value": brandData.id,
      "label": brandData.name,
      "models": getSeparatedModels(brandData.models)
    }
  })
  console.log('completed  separateBrands');
  return result;
}

function getSeparatedModels (modelsToSeparate){
  let result = modelsToSeparate.map( modelData =>{
    return {
      "value": modelData.id,
      "label": modelData.name,
    }
  })
  console.log('completed  getSeparatedModels');
  return result;
}

function getAllModelsData(originalFile){
  console.log('starting getAllModelsData()');

  let result = JSON.parse(JSON.stringify(originalFile));
  let result2= result.models.map( modelData=>{
   return { "value": modelData.id,
          "label": modelData.name}
  })
  console.log(JSON.stringify(result2))
}

function getModelsData(originalFile, modelCode){
  console.log('starting getModelsData(), modelCode is:'+modelCode);
  let result = JSON.parse(JSON.stringify(originalFile));
 
  let brandData=result.brands.find((modelData)=>{
    return modelData.id==modelCode
  })
  return cleanModelData(brandData);
}

function cleanModelData(dataToCLean){
  if(!dataToCLean) return dataToCLean;
  console.log('starting cleanModelData()');
  let result=dataToCLean.models.map( modelData=>{
    return {
      "value": modelData.id,
      "label": modelData.name,
      "years": modelData.years
    }
  })
  return result;
}


module.exports = router;