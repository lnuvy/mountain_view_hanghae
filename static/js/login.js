function login() {
    const userId = $('#userId').val()
    const userPassword = $('#userPassword').val()

    console.log(userId, userPassword)
    $.ajax({
        type: "POST",
        url: "login/validCheck",
        data: {id_give: userId, password_give: userPassword},
        success: function (response) {
            console.log(response['result'])
        }
    })

}