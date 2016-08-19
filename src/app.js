var leanBlog = angular.module('leanBlog', ['ngRoute', 'leanDB'])

leanBlog.config(function($routeProvider){
    $routeProvider

    .when('/',{
        templateUrl: 'templates/article-list.tmpl.html',
        controller: 'MainController',
        resolve: {
            articles: function(leanDB){
                return leanDB.query('select title,time from Article', [])
            }
        }
    })

    .when('/articles/:id', {
        controller: 'DetailController',
        templateUrl: 'templates/article-detail.tmpl.html',
        resolve: {
            article: function(leanDB, $route){
                var aid = $route.current.params.id
                var cql = 'select * from Article where objectId = "' + aid + '"'
                return leanDB.query(cql, [])
            }
        }
    })
/*
    .when('/articles/new', {
        templateUrl: 'templates/article-new.tmpl.html',
        controller: 'NewController'
    })
*/

})

leanBlog.controller('MainController', function($scope, articles){
    $scope.articles = articles
})


leanBlog.controller('DetailController', function($scope, $routeParams, article){

    $scope.aid = $routeParams.id

    console.log($scope.aid)

    $scope.article = article[0]
})

leanBlog.controller('CommentController', function($scope, leanDB, $route){

    var cql = 'select * from Comment where targetArticle = pointer("Article", "' + $scope.$parent.aid + '")'

    leanDB.query(cql,[]).then(function(comments){

        $scope.comments = comments.sort(function(a, b){
            return b.time - a.time
        })

    })

    $scope.newComment = {content: ''}

    $scope.addComment = function(){

        var aid = $scope.$parent.aid,
            content = $scope.newComment.content,
            date = new Date()

        //我从未见过有如此不堪入目之代码！！（+正义之凝视）
        var cql = 'insert into Comment(targetArticle,content,time)' + 
                  ' values(pointer("Article","' + aid +'"), "' + content +'", date("' + date.toJSON() +'"))'

        //var pvalues = [$scope.newComment.content, 'date(' + new Date().toJSON() + ')']

        leanDB.query(cql, []).then(function(data){
            
            //insert仅仅返回id
            $scope.comments.unshift({
                id: data[0].id,
                content: content,
                time: date
            })

            $scope.newComment.content = ''

        }, function(err){
            console.log(err)
        })

    }

})

/*
leanblog.controller('NewArticleController', function($scope, leanDB){


})

leanblog.controller('RegisterAndLoginController', function($scope, leanDB, currentUser){

    AV.User.logIn($scope.email, $scope.password).then(function(loginedUser){
        currentUser.set(loginedUser)
    })



})
*/