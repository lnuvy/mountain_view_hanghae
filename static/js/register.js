// 아이디 유효성 검사
function checkValid(check) {
    var str = check;

//공백만 입력된 경우
    var blank_pattern = /^\s+|\s+$/g;
    if (str.replace(blank_pattern, '') == "") {
        alert('공백만 입력되었습니다.')
        str = null;
    }

//문자열에 공백이 있는 경우
    var blank_pattern = /[\s]/g;
    if (blank_pattern.test(str) == true) {
        alert('공백이 입력되었습니다.');
        str = null;
    }

//특수문자가 있는 경우
    var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
    if (special_pattern.test(str) == true) {
        alert('특수문자가 입력되었습니다.');
        str = null;
    }

//공백 혹은 특수문자가 있는 경우
    if (str.search(/\W|\s/g) > -1) {
        alert('특수문자 또는 공백이 입력되었습니다.');
        str = null;
    }

// 아이디가 너무 짧거나 긴 경우 (4 ~ 15)
    var id_length = /^[a-zA-z0-9]{4,15}$/;
    if (!id_length.test(str)) {
        alert("아이디는 영문/숫자 4~15 자리 내로 입력해야합니다.")
        str = null;
    }

    if(str === null) {
        return false;
    } else {
        return true;
    }
}

function checkPasswordValid(check) {
    var str = check;

//공백만 입력된 경우
    var blank_pattern = /^\s+|\s+$/g;
    if (str.replace(blank_pattern, '') == "") {
        alert('공백만 입력되었습니다.')
        str = null;
    }

//문자열에 공백이 있는 경우
    var blank_pattern = /[\s]/g;
    if (blank_pattern.test(str) == true) {
        alert('공백이 입력되었습니다.');
        str = null;
    }


// 비밀번호가 너무 짧거나 긴 경우 (8 ~ 20)
    var id_length = /^[a-zA-z0-9]{8,15}$/;
    if (!id_length.test(str)) {
        alert("비밀번호는 문자/숫자/특수문자의 8~20 자리 내로 입력해야합니다.")
        str = null;
    }

    if(str === null) {
        return false;
    } else {
        return true;
    }
}


function checkId() {

    const checkId = $('#userId').val()
    const isValid = checkValid(checkId)
    if(!isValid) return;

    $.ajax({
        type: 'POST',
        url: '/registerAction',
        data: {id_give: checkId},
        success: function (response) {
            alert(response['msg'])
            if(response['msg'] !== "이미 존재하는 아이디 입니다!!") {
                const showText = document.getElementById("checkDuplicate")
                showText.style.visibility = "visible";

                $('#userId').attr("readonly", true)
                $('#userId').css({"color": "#d3d3d3"})
            }
        }
    });
}

function checkPassword() {

    const firstPassword = $('#userPassword').val()
    const secondPassword = $('#checkPassword').val()

    const isValid = checkPasswordValid(firstPassword)
    if(!isValid) {
        $('#userPassword').val("")
        $('#checkPassword').val("")
        $('#userPassword').focus();
        return;
    }

    if(firstPassword === secondPassword) {
        const showText = document.getElementById("checkSamePassword")
        showText.style.visibility = "visible";
        $('#userPassword').attr("readonly", true)
        $('#checkPassword').attr("readonly", true)
        $('#userPassword').css({"color": "#d3d3d3"})
        $('#checkPassword').css({"color": "#d3d3d3"})
    } else {
        alert("일치하지 않습니다!")
        $('#checkPassword').val("");
        $('#checkPassword').focus();
    }
}

function register() {
    const userId = $('#userId').val()
    const userPassword = $('#userPassword').val()
    const userNickname = $('#userNickname').val()

    if(userNickname === "") {
        alert("닉네임을 입력하세요!")
        $('#userNickname').focus();
        return;
    }

    $.ajax()

}