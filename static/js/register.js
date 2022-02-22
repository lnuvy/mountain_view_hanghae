

function checkId() {

    const checkId = $('#userId').val()
    console.log(checkId)

    $.ajax({
        type: 'POST',
        url: '/registerAction',
        data: {id_give: checkId},
        success: function (response) {
            alert(response['msg'])
            if(response['msg'] !== "이미 존재하는 아이디 입니다!!") {
                const showText = document.querySelector('.register-text')
                showText.style.visibility = "visible";

                $('#userId').attr("readonly", true)
                $('#userId').css({"color": "#d3d3d3"})
            }
        }
    });
}