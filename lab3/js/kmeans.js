    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */
   
    
    function assignToCluster(theCentroids, theData)
    {
        var dataWithCentroidIndex = theData;
        //console.log(theCentroids);

        for (var i = 0; i < dataWithCentroidIndex.length; i++)
        {
            dataWithCentroidIndex[i]["centroidIndex"] = 0;
        }
        for (var i = 0; i < dataWithCentroidIndex.length; i++)
        {
            distance = 0;
            distanceArray = [];
            for (var j = 0; j < theCentroids.length; j++)
            {
                distance = (Math.pow(parseFloat(dataWithCentroidIndex[i]["A"]) - theCentroids[j]["A"], 2)) +
                            (Math.pow(parseFloat(dataWithCentroidIndex[i]["B"]) - theCentroids[j]["B"], 2)) + 
                            (Math.pow(parseFloat(dataWithCentroidIndex[i]["C"]) - theCentroids[j]["C"], 2));
                distanceArray.push(Math.sqrt(distance));
                
            }
            dataWithCentroidIndex[i]["centroidIndex"] = distanceArray.indexOf(Math.min.apply(Math, distanceArray));
           
            // save the index of the best centroid.
            // the value will correspond to the index in the random array.
            //bestCentroidIndexArray.push(distanceArray.indexOf(Math.min.apply(Math, distanceArray)));
            distance = 0;
            distanceArray = []; 
        }
        //console.log(dataWithCentroidIndex)
        return dataWithCentroidIndex;
    };
    function recalculateCentroids(theDataWithIndex, theCentroids)
    {
        var avgA = 0;
        var avgB = 0;
        var avgC = 0;
        var currIndex;
        var editDataWithIndex = theDataWithIndex;
        var counter;
        var newCentroids = theCentroids;
        var correctIndex = -1;
       // console.log(newCentroids);
        for (var i = 0; i < editDataWithIndex.length; i++)
        {
            currIndex = editDataWithIndex[i]["centroidIndex"];
            //console.log(currIndex);
            if (currIndex != -1)
            {
                for (var j = 0; j < editDataWithIndex.length; j++)
                {
                    if (editDataWithIndex[j]["centroidIndex"] == currIndex)
                    {
                        avgA+=parseFloat(editDataWithIndex[j]["A"]);
                        avgB+=parseFloat(editDataWithIndex[j]["B"]);
                        avgC+=parseFloat(editDataWithIndex[j]["C"]);
                        counter++;
                        correctIndex = currIndex;
                        //set to -1 so theyre not calculated twice or more
                        editDataWithIndex[j]["centroidIndex"] = -1;
                    }
                }
                avgA/=counter;
                avgB/=counter;
                avgC/=counter;
                newCentroids[correctIndex]["A"] = avgA;
                newCentroids[correctIndex]["B"] = avgB;
                newCentroids[correctIndex]["C"] = avgC;
                //console.log(newCentroids);
                counter = 0;
                avgA = 0;
                avgB = 0;
                avgC = 0;
            }
        }
        return newCentroids;
    };
    function kmeans(data, k) 
    {
        console.log(data);
        k = 100;
        var quality = 0;
        var newQuality = 0;
        var iterate = false;     

        /* ska fortfarande ha kvar de gamla klustervärden.
         När punkter inte "byter" centroid till en bättre, då e det klart*/
        
        var listOfRandoms = [];
        // Step 1
        for (var i = 0; i < k; i++)
        {
            /*var random = [(Math.random() * aMaxData) + aMinData,
                            (Math.random() * bMaxData) + bMinData,
                            (Math.random() * cMaxData) + cMinData];*/
            var random = data[Math.floor(Math.random() * data.length)];
            //console.log(random);
            listOfRandoms.push(random);
            //console.log(data);
            
        }
       // console.log(listOfRandoms);
        var dataWithIndex = assignToCluster(listOfRandoms, data);
        //console.log(dataWithIndex);
        

        //assign to cluster
        var distance;
        var distanceArray;
        var minArray = [];
        //var counter = 0;
        var minVal;
        var bestCentroidIndexArray = [];
        var newCentroids = [];
        var iterations = 0;

        var key;
        var newCentroids = recalculateCentroids(dataWithIndex, listOfRandoms);
        //console.log(newCentroids);
        /*do
        {*/
            

            // Step 3

            /* recalculate centroids by computing the average of all data points 
               assigned to each centroid */
           /* var avgA = [];
            var avgB = [];
            
            var avgC = [];
            var counter = [];


            var count = 0;
         
            for (var i = 0; i < bestCentroidIndexArray.length; i++)
            {
                if (bestCentroidIndexArray.includes(i))
                {
                    count++;
                    console.log("HEJJJJJ");
                }
            }
         
            for (var i = 0; i < count; i++)
            {
                counter.push(0);
                avgA.push(0);
                avgB.push(0);
                avgC.push(0);
            }

            newCentroids = [];
         
            for (var i = 0; i < bestCentroidIndexArray.length; i++)
            {
                
                avgA[bestCentroidIndexArray[i]] += parseFloat(data[i]["A"]);
                avgB[bestCentroidIndexArray[i]] += parseFloat(data[i]["B"]);
                avgC[bestCentroidIndexArray[i]] += parseFloat(data[i]["C"]);
                counter[bestCentroidIndexArray[i]] = counter[bestCentroidIndexArray[i]] + 1;
                
                if (i == bestCentroidIndexArray.length - 1)
                {

                    for (var j = 0; j < counter.length; j++)
                    {
                            avgA[j] = avgA[j]/counter[j];
                            avgB[j] = avgB[j]/counter[j];
                            avgC[j] = avgC[j]/counter[j];
                        

                        newCentroids.push([avgA[j], avgB[j], avgC[j]]);
                    }
                        
                        


                }
            }          
          

            // Step 4
            var qualityArray = [];
        
       
            for (var i = 0; i < bestCentroidIndexArray.length; i++)
            {
                if (iterations == 0)
                {
            
                    quality += Math.pow(parseFloat(data[i]["A"]) - 
                    newCentroids[bestCentroidIndexArray[i]][0], 2) + 
                    Math.pow(parseFloat(data[i]["B"]) - 
                    newCentroids[bestCentroidIndexArray[i]][1], 2) + 
                    Math.pow(parseFloat(data[i]["C"]) -
                    newCentroids[bestCentroidIndexArray[i]][2], 2);
                    iterate = true;
                    if (i == bestCentroidIndexArray.length -1)
                    {
                        iterations++;
                    }
                    
                    
                }
                else
                {
                   
                    newQuality += Math.pow(parseFloat(data[i]["A"]) - 
                    newCentroids[bestCentroidIndexArray[i]][0], 2) + 
                    Math.pow(parseFloat(data[i]["B"]) - 
                    newCentroids[bestCentroidIndexArray[i]][1], 2) + 
                    Math.pow(parseFloat(data[i]["C"]) -
                    newCentroids[bestCentroidIndexArray[i]][2], 2);
                    if (i == bestCentroidIndexArray.length -1)
                    {
                        iterations++;
                    }
                }
            }
   
            if (iterations <= 1)
            {
                iterate = true;
            }
            else if (iterations > 1 && newQuality < quality)
            {
                iterate = true;
                quality = newQuality;
            }
            else if (iterations > 1 && newQuality >= quality)
            {
                iterate = false;
            }

           */
        //}while(iterate);



   
        
       






    };