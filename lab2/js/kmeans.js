    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */
   
    
    function assignToCluster(theCentroids, theData)
    {
        var dataWithCentroidIndex = [];
        
        for (var i = 0; i < theData.length; i++)
        {
            dataWithCentroidIndex.push({A:0, B:0, C:0, centroidIndex:0});
            dataWithCentroidIndex[i].A = parseFloat(theData[i]["A"]);
            dataWithCentroidIndex[i].B = parseFloat(theData[i]["B"]);
            dataWithCentroidIndex[i].C = parseFloat(theData[i]["C"]);
        }
        console.log(dataWithCentroidIndex);

        for (var i = 0; i < dataWithCentroidIndex.length; i++)
        {
            distance = 0;
            distanceArray = [];
            for (var j = 0; j < theCentroids.length; j++)
            {
                distance = (Math.pow(parseFloat(dataWithCentroidIndex[i].A) - theCentroids[j].A, 2)) +
                            (Math.pow(parseFloat(dataWithCentroidIndex[i].B) - theCentroids[j].B, 2)) + 
                            (Math.pow(parseFloat(dataWithCentroidIndex[i].C) - theCentroids[j].C, 2));
                distanceArray.push(Math.sqrt(distance));
                
            }
            dataWithCentroidIndex[i].centroidIndex = distanceArray.indexOf(Math.min.apply(Math, distanceArray));
           
            // save the index of the best centroid.
            // the value will correspond to the index in the random array.
            //bestCentroidIndexArray.push(distanceArray.indexOf(Math.min.apply(Math, distanceArray)));
            distance = 0;
            distanceArray = []; 
        }

        return dataWithCentroidIndex;
    };
    function recalculateCentroids(theDataWithIndex, theCentroids)
    {

        var avgA = 0;
        var avgB = 0;
        var avgC = 0;
        var currIndex;
        var editDataWithIndex = [];
        for (var i = 0; i < theDataWithIndex.length; i++)
        {
            editDataWithIndex.push({A:0, B:0, C:0, centroidIndex:0});
            editDataWithIndex[i].A = theDataWithIndex[i].A;
            editDataWithIndex[i].B = theDataWithIndex[i].B;
            editDataWithIndex[i].C = theDataWithIndex[i].C;
            editDataWithIndex[i].centroidIndex = theDataWithIndex[i].centroidIndex;
        }

        var counter;
        var newCentroids = [];
        for (var i = 0; i < theCentroids.length; i++)
        {
            newCentroids.push({A:0, B:0, C:0});
        }
        var correctIndex = -1;
        for (var i = 0; i < editDataWithIndex.length; i++)
        {
            currIndex = editDataWithIndex[i].centroidIndex;
            if (currIndex != -1)
            {
                for (var j = 0; j < editDataWithIndex.length; j++)
                {
                    if (editDataWithIndex[j].centroidIndex == currIndex)
                    {
                        avgA+=parseFloat(editDataWithIndex[j].A);
                        avgB+=parseFloat(editDataWithIndex[j].B);
                        avgC+=parseFloat(editDataWithIndex[j].C);
                        counter++;
                        correctIndex = currIndex;
                        //set to -1 so theyre not calculated twice or more
                        editDataWithIndex[j].centroidIndex = -1;
                    }
                }
                avgA/=counter;
                avgB/=counter;
                avgC/=counter;
                newCentroids[correctIndex].A = avgA;
                newCentroids[correctIndex].B = avgB;
                newCentroids[correctIndex].C = avgC;
                counter = 0;
                avgA = 0;
                avgB = 0;
                avgC = 0;
            }
        }

        return newCentroids;
    };
    function checkQuality(theDataWithIndex, theData, theCentroids)
    {
        var quality = 0;
        var iterations = 0;
        var newQuality = 0;
        do
        {
            var editDataWithIndex = [];
            for (var i = 0; i < theDataWithIndex.length; i++)
            {
                editDataWithIndex.push({A:0, B:0, C:0, centroidIndex:0});
                editDataWithIndex[i].A = theDataWithIndex[i].A;
                editDataWithIndex[i].B = theDataWithIndex[i].B;
                editDataWithIndex[i].C = theDataWithIndex[i].C;
                editDataWithIndex[i].centroidIndex = theDataWithIndex[i].centroidIndex;
            }
            var currIndex = -1;
        
            for (var i = 0; i < editDataWithIndex.length; i++)
            {
                currIndex = editDataWithIndex[i].centroidIndex;
                if (currIndex != -1)
                {
                    for (var j = 0; j < editDataWithIndex.length; j++)
                    {  
                        if (editDataWithIndex[j].centroidIndex == currIndex)
                        {
                            if (iterations == 0)
                            {

                                quality += Math.pow(editDataWithIndex[j].A - theCentroids[currIndex].A, 2) +
                                Math.pow(editDataWithIndex[j].B - theCentroids[currIndex].B, 2) + 
                                Math.pow(editDataWithIndex[j].C - theCentroids[currIndex].C, 2);
                            }
                            else
                            {

                                newQuality += Math.pow(editDataWithIndex[j].A - theCentroids[currIndex].A, 2) +
                                Math.pow(editDataWithIndex[j].B - theCentroids[currIndex].B, 2) + 
                                Math.pow(editDataWithIndex[j].C - theCentroids[currIndex].C, 2);
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
                theDataWithIndex = assignToCluster(theCentroids, theData);
                theCentroids = recalculateCentroids(theDataWithIndex, theCentroids);
            }
            else
            {

                if (newQuality < quality)
                {
                    quality = newQuality;
                    iterations++;
                    iterate = true;
                    theDataWithIndex = assignToCluster(theCentroids, theData);
                    theCentroids = recalculateCentroids(theDataWithIndex, theCentroids);

                }
                else
                {
                    iterations++;
                    iterate = false;
                }
            }
        }while(iterate);
        
        return newQuality;

    };
    function kmeans(data, k) 
    {
        k=100;   

        /* ska fortfarande ha kvar de gamla klustervärden.
         När punkter inte "byter" centroid till en bättre, då e det klart*/
        
        var randomCentroids = [];
        // Step 1
        for (var i = 0; i < k; i++)
        {
            var random = data[Math.floor(Math.random() * data.length)];
            randomCentroids.push(random);
        }
        var dataWithIndex = assignToCluster(randomCentroids, data);
      
        var newCentroids = [];
        var iterations = 0;

        var newCentroids = recalculateCentroids(dataWithIndex, randomCentroids);

        checkQuality(dataWithIndex, data, newCentroids);
        /*do
        {*/
            

           
            // Step 4
           /* var qualityArray = [];
        
       
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