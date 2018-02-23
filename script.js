  $("figure.front").click(function(){
    $(this).parent().toggleClass("flipped");
    return false
  });

  $("div.content").click(function(){
    $(this).children(".flipped").toggleClass("flipped");
  })
