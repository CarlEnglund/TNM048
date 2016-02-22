    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */
   
    
    function assignToCluster(theCentroids, theData, theDim)
    {
        var dataWithCentroidIndex = [];
        for (var i = 0; i < theData.length; i++)
        {
            dataWithCentroidIndex.push([]);
            for (var j = 0; j < theDim.length; j++)
            {
                dataWithCentroidIndex[i].push(parseFloat(theData[i][theDim[j]]));
            }

            dataWithCentroidIndex[i].push(0) // centroid index
        }
        
        for (var i = 0; i < dataWithCentroidIndex.length; i++)
        {
            distance = 0;
            distanceArray = [];
            for (var j = 0; j < theCentroids.length; j++)
            {
                for ( var k = 0; k < theDim.length; k++)
                {
                    distance += (Math.pow(parseFloat(dataWithCentroidIndex[i][k]) - 
                        theCentroids[j][k], 2));
                }
                distanceArray.push(Math.sqrt(distance));
                distance = 0;
            }
        
            dataWithCentroidIndex[i][theDim.length] = distanceArray.indexOf(Math.min.apply(Math, distanceArray));
            distance = 0;
            distanceArray = []; 
        }
        return dataWithCentroidIndex;
    };
    function recalculateCentroids(theDataWithIndex, theCentroids, theDim)
    {
        var avgA = 0;
        var avgB = 0;
        var avgC = 0;
        var currIndex;
        var editDataWithIndex = [];
        var averages = [];

        for (var i = 0; i < theDim.length; i++)
        {
            averages.push(0);
        }

        for (var i = 0; i < theDataWithIndex.length; i++)
        {
            editDataWithIndex.push([]);
            for (var j = 0; j < theDim.length; j++)
            {
                editDataWithIndex[i].push(parseFloat(theDataWithIndex[i][j]));
            }
            editDataWithIndex[i].push(theDataWithIndex[i][theDim.length]); // centroid index
        }

        var counter = 0;
        var newCentroids = [];
        for (var i = 0; i < theCentroids.length; i++)
        {
            newCentroids.push([]);
           for (var j = 0; j < theDim.length; j++)
           {
            newCentroids[i].push(0);
           }
        }
        var correctIndex = -1;
        for (var i = 0; i < editDataWithIndex.length; i++)
        {
            currIndex = editDataWithIndex[i][theDim.length];
            if (currIndex != -1)
            {
                for (var j = 0; j < editDataWithIndex.length; j++)
                {
                    if (editDataWithIndex[j][theDim.length]== currIndex)
                    {
                        for (var k = 0; k < theDim.length; k++)
                        {
                            averages[k]+=editDataWithIndex[j][k];
                        }
                        counter++;
                        correctIndex = currIndex;
                        //set to -1 so theyre not calculated twice or more
                        editDataWithIndex[j].centroidIndex = -1;
                    }
                }
                for (var j = 0; j < averages.length; j++)
                {
                    averages[j]/=counter;
                    newCentroids[correctIndex][j] = averages[j];
                    averages[j] = 0;
                }
                counter = 0;
            }
        }
        return newCentroids;
    };
    function checkQuality(theDataWithIndex, theData, theCentroids, theDim)
    {
        var quality = 0;
        var iterations = 0;
        var newQuality = 0;
        var oldDataWithIndex = [];
        do
        {
            var editDataWithIndex = [];
            for (var i = 0; i < theDataWithIndex.length; i++)
            {
                editDataWithIndex.push([]);
                for (var j = 0; j < theDim.length; j++)
                {
                    editDataWithIndex[i].push(parseFloat(theDataWithIndex[i][j]));
                }
                editDataWithIndex[i].push(theDataWithIndex[i][theDim.length]); // centroid index
            }
            var currIndex = -1;
            
            for (var i = 0; i < editDataWithIndex.length; i++)
            {
                currIndex = editDataWithIndex[i][theDim.length];
                if (currIndex != -1)
                {
                    for (var j = 0; j < editDataWithIndex.length; j++)
                    {  
                        if (editDataWithIndex[j][theDim.length] == currIndex)
                        {
                            if (iterations == 0)
                            {
                                for (var k = 0; k < theDim.length; k++)
                                {
                                    quality+= Math.pow(editDataWithIndex[j][k] - theCentroids[currIndex][k], 2);
                                }
                                
                            }
                            else
                            {
                                for (var k = 0; k < theDim.length; k++)
                                {
                                    newQuality+= Math.pow(editDataWithIndex[j][k] - theCentroids[currIndex][k], 2);
                                }
                            }
                        }
                    }
                }
            }
            if (iterations == 0)
            {
                iterations++;
                iterate = true;
                theDataWithIndex = [];
          
                theDataWithIndex = assignToCluster(theCentroids, theData, theDim);
                theCentroids = recalculateCentroids(theDataWithIndex, theCentroids, theDim);
            

            }
            else
            {
                if (newQuality < quality)
                {
                    quality = newQuality;
                    
                    newQuality = 0;
                    iterations++;
                    iterate = true;
                    theDataWithIndex = assignToCluster(theCentroids, theData, theDim);
                    theCentroids = recalculateCentroids(theDataWithIndex, theCentroids, theDim);
                    oldDataWithIndex = [];
                    // save the old data in case the quality gets worse next iteration
                    for (var i = 0; i < theDataWithIndex.length; i++)
                    {
                        oldDataWithIndex.push([]);
                        for (var j = 0; j < theDim.length; j++)
                        {
                            oldDataWithIndex[i].push(parseFloat(theDataWithIndex[i][j]));
                        }
                            oldDataWithIndex[i].push(theDataWithIndex[i][theDim.length]); // centroid index
                    }

                }
                else
                {
                    iterations++;
                    iterate = false;
                }
            }
        }while(iterate);
        // if the quality got worse on last iteration
        if (oldDataWithIndex.length == theDataWithIndex.length)
        {
            return oldDataWithIndex;
        }
        
        else
        {
            return theDataWithIndex;
        }

   
    };

    function createRandomCentroid(data, dim)
    {
        var random = data[Math.floor(Math.random() * data.length)];
        var randomCentroid = [];
        for (var i = 0; i < dim.length; i++)
        {
            randomCentroid.push(Number(random[dim[i]]));
        }   
        return randomCentroid;
    }

    function kmeans(data, k) 
    {
        //var dim = Object.keys(data[0]);
        var randomCentroids = [];
        var clusterData = [];
        var dim2 = Object.keys(data[0]);
        
        for (var i = 0; i < data.length; i++)
        {
            clusterData.push([]);
            for (var j = 0; j < dim2.length; j++)
            {
                if (dim2[j] != "id" && dim2[j] != "time" && dim2[j] != "place")
                {
                    clusterData[i].push(data[i][dim2[j]]);
                }
            }            
        }
        

        var keys = d3.keys(clusterData[0]);
        var dim = Object.keys(clusterData[0]);
        // Step 1
        for (var i = 0; i < k; i++)
        {
            randomCentroids.push(createRandomCentroid(clusterData, dim));
        }
        var dataWithIndex = assignToCluster(randomCentroids, clusterData, dim);
      
        var newCentroids = [];
        var iterations = 0;

        var newCentroids = recalculateCentroids(dataWithIndex, randomCentroids, dim);

        return checkQuality(dataWithIndex, clusterData, newCentroids, dim);
    };


