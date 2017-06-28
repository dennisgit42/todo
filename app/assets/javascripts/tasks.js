$( document ).ready(function(){
  
  Paloma.start();



  // The taskHTML method takes in a javascript representation 
  // of the task and produces an HTML representation using 
  // <li> tags
  function taskHtml(task) {
    var checkedStatus = task.done? "checked" : "" ;
    var liClass = task.done? "completed" : "";
    var liElement = '<li id="listItem-' + task.id + '" class="' + liClass + '">' + 
      '<div class="view"><input class="toggle" type="checkbox"' +
      " data-id='" + task.id + "'" +
      checkedStatus + 
      '><label>' +
      task.title +
      "<button class='destroy' data-id='" + task.id + "'" +
      "></button>" +  
      '</label></div></li>';
    return liElement;
  }



  // toggleTask takes a HTML representation of the event that fires from an HTML
  // representation of the toggle checkbox and performs an API request to toggle
  // the value of the 'done' field
  function toggleTask(e){
    var itemId = $(e.target).data('id');

    var doneValue = Boolean( $(e.target).is(':checked') );

    $.post("/tasks/" + itemId, {
      _method: "PUT",
      task: {
        done: doneValue
      }
    }).success(function(data){
      var liHtml = taskHtml(data)
      var $li = $("#listItem-" + data.id);
      $li.replaceWith(liHtml);
      $('.toggle').change(toggleTask);
    });
  }

  function deleteTask(event, data){

  }


  $.get("/tasks").success( function(data){
    var htmlString = "";
    $.each(data, function(index, task){
      htmlString += taskHtml(task);
    });
    $('.todo-list').html(htmlString);

    $('.toggle').change(toggleTask);
    $(document).on('click', '.destroy', function(e){
      e.preventDefault();
      var taskId = $(e.target).data('id');
      var liElement = $(e.target).parents('li');
      $.ajax({
        method: 'DELETE',
        url: '/tasks/' + taskId
      });
      liElement.remove();
    });
  });

  $('#new-form').submit(function(event){
    event.preventDefault();
    var textBox = $('.new-todo');
    var payload = {
      task: {
        title: textBox.val()
      }
    };
    // $.post("/tasks", payload).success(function(data){
    //   var htmlString = taskHtml(data);
    //   var ulTodo = $('.todo-list');
    //   ulTodo.append(htmlString);
    //   $('.toggle').change(toggleTask);
    //   $('.new-todo').val("");
    // });

    $.ajax({
      url: "/tasks", 
      data: payload,
      method: "POST",
    }).success(function(data){
      var htmlString = taskHtml(data);
      var ulTodo = $('.todo-list');
      ulTodo.append(htmlString);
      $('.toggle').change(toggleTask);
      $('.new-todo').val("");
    });
  });



});


