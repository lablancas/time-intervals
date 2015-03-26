Package.describe({
    name: 'lablancas:time-intervals',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'Manage one-time and recurring time intervals',
    // URL to the Git repository containing the source code for this package.
    git: 'git@github.com:lablancas/time-intervals.git',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.4.2');

    api.use('mongo');
    api.use('percolate:synced-cron@1.1.1');
    api.use('aldeed:collection2@2.1.0');
    api.use('momentjs:moment@2.9.0');
    
    api.addFiles('time-intervals.js');
    
    api.export('TimeIntervals');
    
});

Package.onTest(function(api) {
    api.use('underscore');
    api.use('mongo');
    api.use('tinytest');
    api.use('momentjs:moment@2.9.0');
    
    api.use('lablancas:time-intervals');
    api.addFiles('time-intervals-tests.js');
    api.addFiles('time-intervals-server-tests.js', 'server');
});
