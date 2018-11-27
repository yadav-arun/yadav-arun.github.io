function inArray(myArray,myValue){
    var inArray = false;
    myArray.map(function(key){
        if (key === myValue){
            inArray=true;
        }
    });
    return inArray;
};

// var temp1 = [];
self.onmessage = function (oEvent) {
    var data = oEvent.data[1];
    var results = oEvent.data[0];

    for (var i = 0; i < results.data.length; i++) {
        data.ballsYearWise[data.matchesData[results.data[i].match_id - 1].season] += 1
        data.runsYearWise[data.matchesData[results.data[i].match_id - 1].season] += results.data[i].total_runs;
        data.runsYearWise["ALL"] += results.data[i].total_runs;
        if (results.data[i].player_dismissed) {
            if (!data.wicketsYearWise[data.matchesData[results.data[i].match_id - 1].season]) {
                data.wicketsYearWise[data.matchesData[results.data[i].match_id - 1].season] = 0;
            }
            data.wicketsYearWise[data.matchesData[results.data[i].match_id - 1].season] += 1;
            data.wicketsYearWise["ALL"] += 1;
        }
        data.runsYearWise[data.matchesData[results.data[i].match_id - 1].season] += results.data[i].total_runs;
        data.runsYearWise["ALL"] += results.data[i].total_runs;

        if (data.noBallsData[data.matchesData[results.data[i].match_id - 1].season][results.data[i].bowler] == undefined) {
            data.noBallsData[data.matchesData[results.data[i].match_id - 1].season][results.data[i].bowler] = 0;
        }
        if (data.noBallsData["ALL"][results.data[i].bowler] == undefined) {
            data.noBallsData["ALL"][results.data[i].bowler] = 0;
        }
        data.noBallsData[data.matchesData[results.data[i].match_id - 1].season][results.data[i].bowler] += results.data[i].noball_runs;
        data.noBallsData["ALL"][results.data[i].bowler] += results.data[i].noball_runs;

        if (data.individualPlayerRunData[data.matchesData[results.data[i].match_id - 1].season][results.data[i].batsman] == undefined) {
            data.individualPlayerRunData[data.matchesData[results.data[i].match_id - 1].season][results.data[i].batsman] = 0;
            data.individualPlayerBallsPlayedData[data.matchesData[results.data[i].match_id - 1].season][results.data[i].batsman] = 0;
        }
        if (data.individualPlayerRunData["ALL"][results.data[i].batsman] == undefined) {
            data.individualPlayerRunData["ALL"][results.data[i].batsman] = 0;
            data.individualPlayerBallsPlayedData["ALL"][results.data[i].batsman] = 0;
        }
        data.individualPlayerRunData[data.matchesData[results.data[i].match_id - 1].season][results.data[i].batsman] += results.data[i].batsman_runs;
        data.individualPlayerRunData["ALL"][results.data[i].batsman] += results.data[i].batsman_runs;

        data.individualPlayerBallsPlayedData[data.matchesData[results.data[i].match_id - 1].season][results.data[i].batsman] += results.data[i].batsman_runs;
        data.individualPlayerBallsPlayedData["ALL"][results.data[i].batsman] += 1;

        if (!data.bowlerThatPlayedAllSeasons[results.data[i].bowler]) {
            data.bowlerThatPlayedAllSeasons[results.data[i].bowler] = [];
        }
        // if (!inArray(temp1, data.matchesData[results.data[i].match_id - 1].season + "_" + results.data[i].bowler)) {
        //     temp1.push(data.matchesData[results.data[i].match_id - 1].season + "_" + results.data[i].bowler);
        //     data.bowlerThatPlayedAllSeasons[results.data[i].bowler].push(data.matchesData[results.data[i].match_id - 1].season);
        // }

        // if (!_.contains(temp1, data.matchesData[results.data[i].match_id - 1].season+"_"+results.data[i].bowler)) {
        //   temp1.push(data.matchesData[results.data[i].match_id - 1].season+"_"+results.data[i].bowler);
        //   data.bowlerThatPlayedAllSeasons[results.data[i].bowler].push(data.matchesData[results.data[i].match_id - 1].season);
        // }

        if (results.data[i].batsman_runs == 4) {
            if (!data.maximumFours[data.matchesData[results.data[i].match_id - 1].season][results.data[i].batsman]) {
                data.maximumFours[data.matchesData[results.data[i].match_id - 1].season][results.data[i].batsman] = 0;
            }
            if (!data.maximumFours["ALL"][results.data[i].batsman]) {
                data.maximumFours["ALL"][results.data[i].batsman] = 0;
            }
            data.maximumFours[data.matchesData[results.data[i].match_id - 1].season][results.data[i].batsman] += 1;
            data.maximumFours["ALL"][results.data[i].batsman] += 1;
        } else if (results.data[i].batsman_runs == 6) {
            if (!data.maximumSixes[data.matchesData[results.data[i].match_id - 1].season][results.data[i].batsman]) {
                data.maximumSixes[data.matchesData[results.data[i].match_id - 1].season][results.data[i].batsman] = 0;
            }
            if (!data.maximumSixes["ALL"][results.data[i].batsman]) {
                data.maximumSixes["ALL"][results.data[i].batsman] = 0;
            }
            data.maximumSixes[data.matchesData[results.data[i].match_id - 1].season][results.data[i].batsman] += 1;
            data.maximumSixes["ALL"][results.data[i].batsman] += 1;
        }

    }

    self.postMessage(data);
};
