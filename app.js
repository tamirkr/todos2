/**
 * Created by Tamir on 14/05/2016.
 */
"use strict";

var app = angular.module("app",['ngStorage']);

app.component('myTodos',{
    templateUrl:'myTodos.html',
    controller:function (storageService) {
        var ctrl = this;
        ctrl.title = 'My Todos';
        ctrl.task = '';

        var todoSave;
        ctrl.$onInit = function () {
            ctrl.todos = storageService.get();
        }
        
        ctrl.complete = storageService.countComplete();


        ctrl.add = function () {

            if(ctrl.task == undefined || ctrl.task.trim().length == 0){
                return;
            }

            storageService.add({id:ctrl.todos.length,name:ctrl.task});
            ctrl.task = undefined;
        }

        ctrl.remove = function (index) {
            storageService.remove(index);
            ctrl.complete = storageService.countComplete();
        }

        ctrl.saveText = function(index, todo) {
            // for(var i = 0; i < ctrl.todos.length; i++) {
            //     todoSave.push(ctrl.todos[i]);
            // }
            // console.log(todoSave);
            todoSave = todo.name;
        }

        ctrl.reset = function(index) {
            ctrl.todos[index].name = todoSave;
            todoSave = '';
        }

        
        ctrl.markAsDone = function (todo) {
            todo.done = todo.done ? false : true;
            ctrl.complete = storageService.countComplete();

        }

        ctrl.total = function () {
            return ctrl.todos.length + ' - total';
        }

        ctrl.markAll = function () {
            storageService.markAll();
            ctrl.complete = storageService.countComplete();
        }

        ctrl.updateToDo = function(index, todo) {
            storageService.update(todo, index);
            todo.edit = false;
        }

    }
});



app.factory('storageService',storageService);
storageService.$inject = ['$localStorage'];
function storageService($localStorage) {
    var markall = false;
    $localStorage = $localStorage.$default({
        todos: []
    });

    var _get = function () {
        return $localStorage.todos;
    }

    var _remove = function (todo) {
        $localStorage.todos.splice($localStorage.todos.indexOf(todo),1);
    }

    var _add = function (todo) {
        $localStorage.todos.unshift(todo);
    }

    var _update = function (todo, index) {
        $localStorage.todos[index] = todo;
    }

    var _markAll = function () {
        for(var i=0;i<$localStorage.todos.length;i++){
            if(!markall){
                $localStorage.todos[i].done = true;
            }
            else{
                $localStorage.todos[i].done = false;
            }
        }
        markall = !markall;
    }

    var _countComplete = function() {
        var num = 0;
        for(var i = 0; i < $localStorage.todos.length; i++){
            if($localStorage.todos[i].done) {
                num++;
            }
        }
        return num;
    }

    return{
        get:_get,
        add:_add,
        remove:_remove,
        countComplete : _countComplete,
        markAll:_markAll,
        update : _update
    };
}

