

$(function()
{
    var i=2;
    $(document).on('click', '.btn-add', function(e)
    {
        e.preventDefault();
        var currentEntry = $(this).parents('.entry:first'),
            newEntry = $(currentEntry.clone()).insertAfter(currentEntry);
        newEntry.find('input').val('');
        newEntry.find('input').attr({name:'option'+i});
       i++
        $('form').find('.entry:not(:last) .btn-add')
            .removeClass('btn-add').addClass('btn-remove')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');

    }).on('click', '.btn-remove', function(e)
    {
		$(this).parents('.entry:first').remove();
		e.preventDefault();
		return false;
	});
  
});