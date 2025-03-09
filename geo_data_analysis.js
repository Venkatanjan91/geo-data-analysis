var image = s2.filterDate('2023-01-01', '2023-12-31').filterBounds(ddn).median();
var bands = ['B2', 'B3', 'B4', 'B8'];
var image = image.select(bands).addBands(image.normalizedDifference(['B8',
'B4']).rename('NDVI'));
var displayparameters = {
min: 1000,
max: 4500,
bands: ['B8', 'B4', 'B3'],
};
Map.addLayer(image,displayparameters,"Image");
var label = "Class";
var training = Water.merge(Forest).merge(Urban)
var trainingimage = image.sampleRegions({
collection: training,
properties: [label],scale: 10
})
var traingData = trainingimage.randomColumn();
var trainSet = traingData.filter(ee.Filter.lessThan('random',0.8));
var testSet = traingData.filter(ee.Filter.greaterThanOrEquals('random',0.8));
var classifier = ee.Classifier.smileRandomForest({numberOfTrees:100, variablesPerSplit: 2,
minLeafPopulation: 1, bagFraction: 0.5,seed: 0});
var classifier = ee.Classifier.smileRandomForest(100).train(trainSet, label, bands);
var classified = image.classify(classifier);
Map.centerObject(ddn, 10);
Map.addLayer(classified, {min: 1, max: 3, palette: ['green', 'blue', 'red']}, 'LandCover');
print('Results of trained classifier', classifier.explain());
var trainAccuracy = classifier.confusionMatrix();
print('Training error matrix', trainAccuracy);
print('Training overall accuracy', trainAccuracy.accuracy());
testSet = testSet.classify(classifier);
var validationAccuracy = testSet.errorMatrix(label,'classification');
print('Validation error matrix', validationAccuracy);
print('Validation accuracy', validationAccuracy.accuracy());

