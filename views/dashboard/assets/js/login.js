$(document).ready(function () {
    var headers = new Headers()
    headers.append("Content-Type", "application/json")

    var getUrl = window.location
    var base = getUrl.protocol + "//" + getUrl.host

    let btnlogin = document.getElementById('btn_login')
    if (btnlogin) {
        document.querySelector('#btn_login').addEventListener('click', (e) => {
            e.preventDefault();
            let email = document.querySelector("#email").value,
                pass = document.querySelector("#password").value
            if (email && pass) {
              LoginAdmin(email, pass)
            } else {
                Swal.fire(
                    'Error',
                    'All fields are compulsory',
                    'error'
                )
            }

        })
    }

    let btnzonallogin = document.getElementById('btn_zonal_login')
    if (btnzonallogin) {
        document.querySelector('#btn_zonal_login').addEventListener('click', (e) => {
            e.preventDefault();
            let email = document.querySelector("#email").value,
                pass = document.querySelector("#password").value,
                zone = document.querySelector("#zone").value
            if (email && pass) {
                LoginZone(email, pass, zone)
            } else {
                Swal.fire(
                    'Error',
                    'All fields are compulsory',
                    'error'
                )
            }

        })
    }

    /** login to zonal dashboard */
    function LoginZone(email, pass, zone) {
        $("#btn_zonal_login").html('<i class="fa fa-spin fa-spinner"></i>  Processing ... ')
        var headers = new Headers()
        headers.append("Content-Type", "application/json")
        let raw = JSON.stringify({
            "email": email,
            "password": pass,
            "zone": zone
        });

        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        };

        fetch(base + "/api/auth/zone", requestOptions)
            .then(response => response.json())
            .then(data => {
                $("#btn_zonal_login").html('Login to Dashboard')
                if (data.status == true) {
                    Swal.fire(
                        'Success',
                        data.response,
                        'success'
                    )
                    window.location.href = "/zonal-admin/main"
                } else {
                    Swal.fire(
                        'Error',
                        data.response,
                        'error'
                    )
                }

            })
            .catch(error => console.log('error', error));
    }

    /** login to admin dashboard */
    function LoginAdmin(email, pass) {
        $("#btn_login").html('<i class="fa fa-spin fa-spinner"></i>  Processing ... ')
        var headers = new Headers()
        headers.append("Content-Type", "application/json")
        let raw = JSON.stringify({
            "email": email,
            "password": pass
        });

        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        };

        fetch(base + "/api/auth/admin", requestOptions)
            .then(response => response.json())
            .then(data => {
                $("#btn_login").html('Login to Dashboard')
                if (data.status == true) {
                    Swal.fire(
                        'Success',
                        data.response,
                        'success'
                    )
                    window.location.href = "/super-admin/main"
                } else {
                    Swal.fire(
                        'Error',
                        data.response,
                        'error'
                    )
                }

            })
            .catch(error => console.log('error', error));
    }


/**
 * init salvation event
 */
let salv = document.getElementById('modal_salv')
if (salv) {
    document.querySelector('#modal_salv').addEventListener('click', (e) => {
        document.querySelector("#salvres").innerHTML = ""
        let email = document.querySelector("#emailaddr").value,
            names = document.querySelector("#names").value,
            phone = document.querySelector("#phone").value,
            countrycode = document.querySelector("#phonecode").value,
            ref = document.querySelector("#src").value
            
        if (email && phone && names) {
            if (validateEmail(email) == false) {
                document.querySelector("#salvres").innerHTML = "<span style='color:Red'> invalid email </span>"
            } else {
                document.querySelector('#salvspinner').classList.remove("d-none")
                document.querySelector('#salvstatus').classList.remove("d-none")
                salvation(email, names, phone, ref)
            }
        } else {
            document.querySelector("#salvres").innerHTML = "<span style='color:Red'> All fields are compulsory. </span>"
        }
    })
}

 /**
 * Summary of Salvation function
 * @param {*} email 
 * @param {*} names 
 * @param {*} phone 
 * @param {*} ref 
 */
function salvation(email, names, phone, ref) {
    document.querySelector('#modal_salv').classList.add("d-none")
    let country = document.querySelector("#ip_country").innerHTML,
        city = document.querySelector("#ip_city").innerHTML,
        continent = document.querySelector("#ip_continent").innerHTML,
        ip = document.querySelector("#ipaddress").innerHTML

    let h = new Headers();
    h.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "names": names,
        "phone": phone,
        "email": email,
        "country": country,
        "city": city,
        "ref": ref
    })

    let options = {
        method: 'POST',
        headers: h,
        body: raw,
        redirect: 'follow'
    }
    document.querySelector('#salvspinner').classList.remove("d-none")
    document.querySelector('#salvstatus').classList.remove("d-none")
    fetch(base + "/api/user/salvation", options)
        .then(response => response.json())
        .then(result => {
            document.querySelector('#modal_salv').classList.remove("d-none")
            document.querySelector('#salvspinner').classList.add("d-none")
            console.log(result)
            if (result.status == true) {
                Swal.fire(
                    'Success',
                    result.response,
                    'success'
                )
                document.querySelector('#salvspinner').classList.add("d-none")

                if(result.source == 'ambassador'){
                    window.location.href ='https://ambassador.rhapsodyofrealities.org/'
                }else if(result.source == 'rinrhapsodyhunt'){
                    window.location.href ='https://rinrhapsodyhunt.org/'
                }else if(result.source == 'distribution'){
                    window.location.href ='https://distribution.rhapsodyofrealities.org/'
                }
                bornagain_email(result.email, result.names, result.source)
            } else {
                Swal.fire(
                    'Error',
                    'Salvation Submission Failed!!!...',
                    'error'
                )
            }
        })
        .catch(error => console.log('error', error));
}


/**
 * send bornagain email
 */
function bornagain_email(email, name, src) {
    let raw = JSON.stringify({
        "email": email,
        "name": name,
        "src":src,
        "type": "bornagain"
    })

    var requestOptions = {
        method: 'POST',
        headers: headers,
        body: raw,
        redirect: 'follow'
    };

    fetch(base + "/mailer/user/bornagain", requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}


/**
 * It checks if the email address is in the correct format
 * @param email - The email address to validate.
 * @returns A boolean value.
 */
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
   

})