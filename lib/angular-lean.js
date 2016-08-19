angular.module('leanDB', [])
    .constant('LEAN_DB',{
        'APP_ID': 'oE6nrXfeSIBdGPxMm0XINHB9-gzGzoHsz',
        'APP_KEY': 'dFvoexXSk6iePA6CnPRsUSBr',
    })

    .factory('leanDB', function($q, LEAN_DB){

        AV.init({
            appId: LEAN_DB.APP_ID,
            appKey: LEAN_DB.APP_KEY
        })

        //一律采用CQL
        return {

            query: function(cql, pvalues){

                var deferred = $q.defer()

                AV.Query.doCloudQuery(cql, pvalues).then(function(data){
                    
                    var results = data.results,
                        output = []

                    results.forEach(function(result){

                        var mixin = {}

                        mixin['id'] = result.id
                        
                        for(var i in result._serverData){
                            mixin[i] = result.get(i)
                        }

                        output.push(mixin)
                    })

                    deferred.resolve(output)

                }, function(err){
                    console.log(err)
                    deferred.reject(err)
                })

                return deferred.promise
            },

            saveItemWithRelation: function(Table, obj){
                /*
                obj{
                    item: jsbj,
                    bind: [{
                        targetTable: _User,
                        id: 5af3463ccde4b097
                    }{
                        targetTable: _Article,
                        id: 5af3463ccde4b097
                    }]
                }           
                */ 


            },

            currentUser: AV.User.current(),

            createUser: function(obj){},

            login: function(obj){}
        }
    })