/**
* Created with MakeItHappen.
* User: lablancas
* Date: 2015-03-26
* Time: 02:46 PM
* To change this template use Tools | Templates.
*/

cleanup = function(){
    TimeIntervals.find().forEach(function(t){ TimeIntervals.remove(t._id); });
};

Tinytest.add('Time Intervals - Update Recurring Time Intervals', function(test){
    var startDate = new Date()
    
    var timeInterval = {
        active: true,
        profile: {
            name: "My Time Interval",
            recurrence: { type: 'days', length: 7 },
            startDate: startDate,
            endDate: moment(startDate).add(7, "days").subtract(1, "seconds")._d
        }
    };
    
    // should NOT be updated because end date has NOT passed
    TimeIntervals.insert(timeInterval);
    test.equal(TimeIntervals.updateRecurring(), 0);
    
    // should NOT be updated because time interval is inactive
    timeInterval.active = false;
    TimeIntervals.insert(timeInterval);
    test.equal(TimeIntervals.updateRecurring(), 0);
    
    
    // should be updated because is active, has recurrence and end date has passed
    timeInterval.active = true;
    timeInterval.profile.endDate = moment(new Date()).subtract(1, "seconds")._d;
    var _id = TimeIntervals.insert(timeInterval);
    test.equal(TimeIntervals.updateRecurring(), 1);
    
    // should NOT be updated because does not have recurrence
    timeInterval.profile.recurrence = undefined;
    timeInterval.profile.endDate = moment(startDate).add(7, "days").subtract(1, "seconds")._d;
    TimeIntervals.insert(timeInterval);
    test.equal(TimeIntervals.updateRecurring(), 0);
    
    cleanup();
});