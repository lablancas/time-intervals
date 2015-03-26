/**
* Created with MakeItHappen.
* User: lablancas
* Date: 2015-02-20
* Time: 06:08 PM
* To change this template use Tools | Templates.
*/

/**
 * TimeIntervals
 * 
 * 
 * 
 */
TimeIntervals = new Mongo.Collection("timeIntervals");
TimeIntervals.attachSchema(new SimpleSchema({
    active:              { type: Boolean },
    'profile':           { type: Object  },
    'profile.name':      { type: String  },
    
    'profile.recurrence': { type: Object, optional: true  },
    
    'profile.recurrence.type':   { type: String, allowedValues: ['days', 'weeks', 'months']  },
    'profile.recurrence.length': { type: Number  },
    
    'profile.startDate': { type: Date },
    'profile.endDate':   { type: Date } //Should this be optional and considered as never ending if not present?
}));
TimeIntervals.attachSchema = undefined;

TimeIntervals.findActive = function(){
  return TimeIntervals.find({active: true, 'profile.startDate': {$lte: new Date()}, 'profile.endDate': {$gte: new Date()}});  
};

if (Meteor.isServer) {
    
    TimeIntervals.debug = true;
    
    
    TimeIntervals.updateRecurring = function() {
        var _self = this;
        var logPrefix = "'Update Recurring Time Intervals': ";
        var timeIntervalsUpdated = 0;
        
        var cursor = _self.find({active: true, 'profile.recurrence': {$exists: true}, 'profile.endDate': {$lt: new Date()}});
        
        TimeIntervals.debug && console.log("Found " + cursor.count() + " time intervals to update");

        cursor.forEach(function(doc){
            TimeIntervals.debug && console.log(logPrefix + "deactivating expired time intervals");
            TimeIntervals.debug && console.log(doc);

            _self.update(doc._id, {$set: {active: false}});

            var startDate = moment(doc.profile.endDate).add(1, "seconds")._d;

            var newDoc = {
                active: true,
                profile: {
                    name: doc.profile.name,
                    recurrence: doc.profile.recurrence,
                    startDate: startDate,

                    // TODO should I subtract 1 millisecond?
                    endDate: moment(startDate).add(doc.profile.recurrence.length, doc.profile.recurrence.type).subtract(1, "seconds")._d
                }
            };

            TimeIntervals.debug && console.log(logPrefix + "creating a new, recurring time interval");
            TimeIntervals.debug && console.log(newDoc);
            _self.insert(newDoc);
            timeIntervalsUpdated++;
        });

        return timeIntervalsUpdated;
    };
    
    //TimeIntervals.ScheduleFrequency = 'every 1 minutes';

    Meteor.startup(function () {
        var timeIntervalsUpdated = 0;

        do {
            timeIntervalsUpdated = TimeIntervals.updateRecurring();
            TimeIntervals.debug && console.log(timeIntervalsUpdated + " recurring time interval(s) created");
        }
        while (timeIntervalsUpdated > 0);

        SyncedCron.add({
            name: 'Update Recurring Time Intervals',
            schedule: function(parser) {
                // parser is a later.parse object
                return parser.text(TimeIntervals.ScheduleFrequency || 'every 1 minutes');
            }, 
            job: TimeIntervals.updateRecurring
        });
        
    });
}