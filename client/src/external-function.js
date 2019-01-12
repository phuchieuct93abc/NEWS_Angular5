$(function () {
    $(document).on('click', '.open-video', function () {
        const url = $(this).parent().prev(".body-video").find('source').attr('src');
        $(this).attr('target', '_blank');
        $(this).attr('href', url);
    })
})