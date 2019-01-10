$(function () {
    $(document).on('click', '.open-video', function () {
        window.open($(this).parent().prev(".body-video").find('source').attr('src'), '_blank')
    })
})