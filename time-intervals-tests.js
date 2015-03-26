// Write your tests here!
// Here is an example.
Tinytest.add('Time Intervals - Validate Exported Object', function (test) {
    test.instanceOf(TimeIntervals, Mongo.Collection);

    test.instanceOf(TimeIntervals.insert, Function);
    test.instanceOf(TimeIntervals.update, Function);
    test.instanceOf(TimeIntervals.remove, Function);
    
    
    test.isUndefined(TimeIntervals.attachSchema);
});

cleanup = function(){
    TimeIntervals.find().forEach(function(t){ TimeIntervals.remove(t._id); });
};

Tinytest.add('Time Intervals - Queries', function(test){
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
    
    timeInterval._id = TimeIntervals.insert(timeInterval);
    
    test.isTrue( Match.test(timeInterval._id, String) );
    
    var foundTimeInterval = TimeIntervals.findOne(timeInterval._id);
    
    test.equal(foundTimeInterval, timeInterval);
    
    test.equal(TimeIntervals.findActive().count(), 1);
    
    var timeInterval2 = {
        active: false,
        profile: {
            name: "My 2nd Time Interval",
            recurrence: { type: 'weeks', length: 2 },
            startDate: startDate,
            endDate: moment(startDate).add(2, "weeks").subtract(1, "seconds")._d
        }
    };
    
    timeInterval2._id = TimeIntervals.insert(timeInterval2);
    
    test.isTrue( Match.test(timeInterval2._id, String) );
    
    var foundTimeInterval2 = TimeIntervals.findOne(timeInterval2._id);
    
    test.equal(foundTimeInterval2, timeInterval2);
    
    test.equal(TimeIntervals.findActive().count(), 1);
    
    test.equal(TimeIntervals.find().count(), 2);
    
    
    cleanup();
    
    
    test.equal(TimeIntervals.findActive().count(), 0);
    
    test.equal(TimeIntervals.find().count(), 0);
});

//TODO decide on test cases/scenarios to run