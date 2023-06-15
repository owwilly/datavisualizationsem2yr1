$(document).ready(function () {
    var headers = new Headers()
    headers.append("Content-Type", "application/json")

    var getUrl = window.location
    var base = getUrl.protocol + "//" + getUrl.host

    const API_USER_ACTIVATE = 'https://rowtoken.rhapsodyofrealities.org/api/subscription-no-auth/add'
    const ADMIN_SEARCH = '/admin/search/'

    /*
     * login function
     */
    let btnlogin = document.getElementById('btn_login')
    if (btnlogin) {
        initFingerprintJS()
        document.querySelector('#btn_login').addEventListener('click', (e) => {
            e.preventDefault();
            let email = document.querySelector("#email").value,
                pass = document.querySelector("#password").value,
                auth = document.querySelector("#regauth").value
            if (email && pass) {
                Login(email, pass, auth)
            } else {
                Swal.fire(
                    'Error',
                    'All fields are compulsory',
                    'error'
                )
            }

        })
    }

    function initFingerprintJS() {
        FingerprintJS.load().then(fp => {
            fp.get().then(result => {
                const visitorId = result.visitorId;
                setCookie("_FP_ID_", visitorId, 365);
            });
        });
    }

    /**
     * The function takes three parameters: the name of the cookie, the value of the cookie, and the
     * number of days until the cookie expires
     * @param cname - The name of the cookie.
     * @param cvalue - The value of the cookie.
     * @param exdays - The number of days you want the cookie to exist for.
     */
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    /**
     *  function to get cookie
     * It takes a cookie name as a parameter and returns the value of the cookie
     * @param cname - The name of the cookie you want to get.
     * @returns The value of the cookie.
     */
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    /**
     * login to zonal dashboard 
     * It takes the email, password and the authorization token as parameters and then sends a POST request
     * to the server
     * @param email - The email address of the user.
     * @param pass - The password you want to use.
     * @param auth - This is the authorization token that you get from the login API.
     */
    function Login(email, pass, auth) {
        $("#btn_login").html('<i class="fa fa-spin fa-spinner"></i>  Processing ... ')
        setCookie("email", email, 365);
        let headers = new Headers();
        headers.append("Authorization", "Bearer " + auth);
        headers.append("Content-Type", "application/json");
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
                    window.location.href = "/admin/statistics"
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
     * Vouchers Download PDF
     */
    function DownloadPDF(package, quantity, vouchers_bought, auth) {
        // console.log(package+'---'+quantity+'---'+vouchers_bought)
        var quantity_ = quantity
        var package_ = package
        var vouchers_bought = vouchers_bought
        var user_email = getCookie("email")

        let headers = new Headers()
        headers.append("Authorization", "Bearer " + auth)
        headers.append("Content-Type", "application/json")

        let raw = JSON.stringify({
            "vo_quantity": quantity_,
            "vo_package": package_,
            "user_email": user_email,
            "vo_vouchers_bought": vouchers_bought
        })
        var options = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        }


        fetch("https://vouchers.readandearn.org/api/voucher/generatePDF", options)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                if (result.status == true) {
                    let raw2 = JSON.stringify({
                        "file_name": result.pdf_file_name
                    })
                    var options2 = {
                        method: 'POST',
                        headers: headers,
                        body: raw2,
                        redirect: 'follow'
                    }
                    fetch("https://vouchers.readandearn.org/api/voucher/unlink", options2)
                        .then(response => response.json())
                        .then(result => {

                            if (result.status == false) {
                                Swal.fire(
                                    'Error',
                                    "Oops!".result.response,
                                    'error'
                                )
                            }
                        })
                        .catch(error => console.log('error', error));
                    document.querySelector("#d_link").innerHTML = "<span style='color:green'> <strong>SUCCESS!</strong> Vouchers successfully generated. Click this <a target='_blank' href='https://rhapsodyofrealities.b-cdn.net/voucherspdf/" + result.pdf_file_name + "' style='color:blue;' download> LINK </a> to download  </span>"
                    Swal.fire(
                        'Success',
                        "Vouchers Created! Click this <a target='_blank' href='https://rhapsodyofrealities.b-cdn.net/voucherspdf/" + result.pdf_file_name + "' style='color:blue;' download> LINK </a> to download in PDF",
                        'success'
                    )

                } else {
                    Swal.fire(
                        'Error',
                        "Something happened" + result.status,
                        'error'
                    )

                }

            })
            .catch(error => console.log('error', error));

    }


    /**
     * Generate Vouchers
     * It takes in the package, quantity, user_email and auth as parameters, and then makes a GET
     * request to the API endpoint
     * @param package - The package you want to generate vouchers for.
     * @param quantity - This is the number of vouchers you want to generate.
     * @param user_email - The email address of the user who is generating the vouchers.
     * @param auth - This is the token you get from the login API.
     */
    function GenerateVouchers(package, quantity, user_email, auth) {
        $("#btn_gen_vouchers").html('<i class="fa fa-spin fa-spinner"></i>  Processing ... ')
        Swal.fire(
            "Success",
            'Your vouchers are generating, and will be sent to your email once done. Please check your INBOX or SPAM folder in the next few moments. THANKS',
            'info'
        )
        let headers = new Headers();
        headers.append("Authorization", "Bearer " + auth);
        headers.append("Content-Type", "application/json");


        let requestOptions = {
            method: 'GET',
            headers: headers,

            redirect: 'follow'
        };

        fetch("https://vouchers.readandearn.org/api/voucher/generate/" + package + "/" + quantity + "/" + user_email, requestOptions).catch(error => alert(error));

        $("#btn_gen_vouchers").html('Generate Again');
    }

    let addZoneBtn = document.getElementById('addZoneBtn')
    if (addZoneBtn) {
        document.querySelector('#addZoneBtn').addEventListener('click', function (e) {
            e.preventDefault();

            $("#add_processing").html('<i class="fa fa-spin fa-spinner"></i>  Processing ... ');
            let zonalName = $('#add_zone_name').val();

            let raw = JSON.stringify({
                "zonalName": zonalName
            });

            let requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
            };

            fetch(base + "/api/admin/addzone", requestOptions)
                .then(response => response.json())
                .then(data => {
                    $("#add_processing").html('<i class="fa fa-check text-success"></i>  Done ... ');
                    if (data.status == true) {
                        window.location.href = "/admin/manage-zones"
                    } else {
                        Swal.fire(
                            'Error',
                            data.response,
                            'error'
                        )
                        console.log(data.response);

                    }

                })
                .catch(error => console.log('error', error));
        })
    }



    let activateUserAc = document.getElementById('activateAccountBtn')
    if (activateUserAc) {
        document.querySelector('#activateAccountBtn').addEventListener('click', function (e) {
            e.preventDefault(); 
            let userEmail = $('#activate_add_user_email').val(),
                SubscriptionPackage = $('#activate_add_package').val()
                if(userEmail){
                    activate_user(userEmail, SubscriptionPackage)
                }else{
                    Swal.fire(
                        'Error',
                        'Email is required',
                        'error'
                    )
                } 
        })
    }

    /**
     * It takes two parameters, the user's email and the subscription package, and then sends a POST
     * request to the API endpoint to activate the user.
     * @param userEmail - The email of the user you want to activate
     * @param SubscriptionPackage - This is the package you want to activate the user with.
     */
    let activate_user = (userEmail, SubscriptionPackage) => {
        $("#add_loading").html('<i class="fa fa-spin fa-spinner"></i>  Processing ... ')
        let raw = JSON.stringify({
            "email": userEmail,
            "package": SubscriptionPackage
        })

        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        }

        fetch(API_USER_ACTIVATE, requestOptions)
            .then(response => response.json())
            .then(data => {
                $("#add_loading").html('<i class="fa fa-check text-success"></i>  Done... ');
                if (data.status == true) {
                    window.location.href = ADMIN_SEARCH + getid()
                } else {
                    Swal.fire(
                        'Error',
                        data.response,
                        'error'
                    )
                } 
            })
            .catch(error => console.log('error', error))
    }



    let btn_gen_vouchers = document.getElementById('btn_gen_vouchers')
    if (btn_gen_vouchers) {
        document.querySelector('#btn_gen_vouchers').addEventListener('click', (e) => {
            let v_package = document.querySelector("#vpackage").value,
                quantity = document.querySelector("#quantity").value,
                auth = document.querySelector("#regauth").value
            var user_email = getCookie("email")
            if (v_package && quantity) {
                GenerateVouchers(v_package, quantity, user_email, auth)
            } else {
                Swal.fire(
                    'Error',
                    'All fields are compulsory',
                    'error'
                )
            }

        })
    }

    // Attempting to change Zone name
    $('.editZoneModalBtn').on('click', function () {
        let id = $(this).data("id");
        let oldName = $(this).data("oldname");
        console.log(`Old Name: ${oldName}\nZone ID: ${id} `);

        $('#old_zone_name').val(oldName);

        // Zone Modal submission
        $('#editZoneBtn').on('click', function () {
            console.log('Changing name');
            $("#add_processing_a").html('<i class="fa fa-spin fa-spinner"></i>  Processing ... ');
            let newName = $('#new_zone_name').val();

            let raw = JSON.stringify({
                "rgn_id": id,
                "new_name": newName
            });

            let requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
            };

            fetch(base + "/api/admin/updatezone", requestOptions)
                .then(response => response.json())
                .then(data => {
                    $("#add_processing_a").html('<i class="fa fa-check text-success"></i>  Done ... ');
                    if (data.status == true) {
                        window.location.href = "/admin/manage-zones"
                    } else {
                        Swal.fire(
                            'Error',
                            data.response,
                            'error'
                        )
                        console.log(data.response);

                    }

                })
                .catch(error => console.log('error', error));
        });

    });
    
    /*
     * Reset User Password
     */
    let btn_reset_user_password = document.getElementById('btn_reset_user_password')
    if (btn_reset_user_password) {
        document.querySelector('#btn_reset_user_password').addEventListener('click', (e) => {
            document.querySelector("#d_link").innerHTML = "<span style='color:blue'> <strong> Processing,</strong> please wait... </span>"
            let client_email = document.querySelector("#user_email").value,
                newpassword = document.querySelector("#newpassword").value
                             
            if (client_email && newpassword) {
                resetuseremail(client_email, newpassword)
                document.querySelector("#user_email").value=""
                document.querySelector("#newpassword").value=""
            } else {
                document.querySelector("#d_link").innerHTML = "<span style='color:red'>Oops! All fields are required. </span>"
                Swal.fire(
                    'Error',
                    'All fields are compulsory',
                    'error'
                )
            }

        })
    }
    
    /**
     * It takes the email address as a parameter and sends a request to the server to send a password reset
     * link to the email address
     * @param client_email - The email address of the user.
     */
     function resetuseremail(client_email, newpassword) {
        let raw = JSON.stringify({
            "email": client_email,
            "newpassword" : newpassword
        })
        
        let options = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        }

        fetch(base + "/api/password/reset", options)
            .then(response => response.json())
            .then(result => {
                if (result.status == 1) {
                    resetuserpassword_email(client_email, newpassword)
                    Swal.fire(
                        'Success',
                        'Password Reset Successfuly',
                        'success'
                    )
                    document.querySelector("#d_link").innerHTML = "<span style='color:green'> <strong>Success! password reset successfully.</strong> </span>"
                } else {
                    Swal.fire(
                        'Error',
                        'Password Not Reset! Please try again.',
                        'error'
                    )
                    document.querySelector("#d_link").innerHTML = "<span style='color:red'> <strong>Oops! password reset failed.</strong> </span>"
                }
            })
            .catch(error => console.log('error', error));
    }
    /**
     * forgot password email
     */
     function resetuserpassword_email(email, newpassword) {
        let raw = JSON.stringify({
            "email": email,
            "newpassword":newpassword,
            "type": "forgotpassword"
        })
        var options = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        }

        fetch(base + "/mailer/user/forgotpassword", options)
            .then(response => response.json())
            .then(result => {
                if (result.status == true) {
                    Swal.fire(
                        'Success',
                        'New Password sent to user\'s email.',
                        'success'
                    )
                } else {
                    Swal.fire(
                        'Error',
                        'Email Not Sent!',
                        'error'
                    )
                }
            })
            .catch(error => console.log('error', error))
    }
    /*
     * create credentials
     */
    let btn_create_creds_zone = document.getElementById('btn_create_creds_zone')
    if (btn_create_creds_zone) {
        document.querySelector('#btn_create_creds_zone').addEventListener('click', (e) => {
            let email = document.querySelector("#add_cred_email").value,
                pass = document.querySelector("#add_cred_password").value,
                zoneid = document.querySelector("#add_cred_zoneid").value
            if (email && pass && zoneid) {
                CreateZonalCreds(zoneid, email, pass)
            } else {
                Swal.fire(
                    'Error',
                    'All fields are compulsory',
                    'error'
                )
            }

        })
    }


    /**
     * Create Credentials for a zone
     * It takes the zone id, email and password as parameters and then sends a POST request to the API
     * endpoint to create the credentials
     * @param zoneid - The ID of the zone you want to create credentials for.
     * @param email - The email address of the user
     * @param password - The password for the user
     */
    function CreateZonalCreds(zoneid, email, password) {
        $("#btn_create_creds_zone").html('<i class="fa fa-spin fa-spinner"></i>  Creating Credentials')
        let raw = JSON.stringify({
            "rgn_id": zoneid,
            "useremail": email,
            "userpassword": password
        })

        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        }

        fetch(base + "/api/credentials/zone", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status == true) {
                    $("#btn_create_creds_zone").html('<i class="fa fa-spin fa-spinner"></i>  Refreshing ...')
                    window.location.href = "/admin/activate-zones"
                } else {
                    $("#btn_create_creds_zone").html('Create Credentials')
                    Swal.fire(
                        'Error',
                        result.response,
                        'error'
                    )
                }
            })
            .catch(error => console.log('error', error));
    }

    /**
     * Change Status of Zone
     */
    let btn_change_status_zone = document.getElementById('btn_change_status_zone')
    if (btn_change_status_zone) {
        document.querySelector('#btn_change_status_zone').addEventListener('click', (e) => {
            let status = document.querySelector("#status_value").value,
                zoneid = document.querySelector("#status_zoneid").value
            if (status && zoneid) {
                ChangeStatus(zoneid, status)
            } else {
                Swal.fire(
                    'Error',
                    'All fields are compulsory',
                    'error'
                )
            }

        })
    }


    /**
     * Change Status of a Zone
     * It takes the zone id and the status of the zone as parameters and then sends a POST request to the
     * API endpoint to change the status of the zone
     * @param zoneid - The id of the zone you want to change the status of.
     * @param status - This is the status of the zone. It can be either 0 or 1.
     */
    function ChangeStatus(zoneid, status) {
        $("#btn_change_status_zone").html('<i class="fa fa-spin fa-spinner"></i>  Changing Status ...')
        var raw = JSON.stringify({
            "rgn_id": zoneid,
            "is_active": status
        });

        var requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        };

        fetch(base + "/api/status/zone", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status == true) {
                    $("#btn_change_status_zone").html('<i class="fa fa-spin fa-spinner"></i>  Refreshing ...')
                    window.location.href = "/admin/activate-zones"
                } else {
                    $("#btn_change_status_zone").html('Create Credentials')
                    Swal.fire(
                        'Error',
                        result.response,
                        'error'
                    )
                }
            })
            .catch(error => console.log('error', error));
    }



    let btn_email_search = document.getElementById('btn_search_by_email')
    if (btn_email_search) {
        document.querySelector('#btn_search_by_email').addEventListener('click', (e) => {
            let email = document.querySelector("#email_search").value
            if (email) {
                window.location.href = "/admin/search/" + email
            } else {
                Swal.fire(
                    'Error',
                    'All fields are compulsory',
                    'error'
                )
            }

        })
    }


    document.querySelector('#btn_rzm_login').addEventListener('click', (e) => {
        e.preventDefault();
        $('#btn_rzm_login').html('<i class="fa fa-spin fa-spinner"></i>  Processing ... ');
        let email = $('#email').val();
        let pass = $('#password').val();
        let auth = $('#regauth').val();

        console.log(`Email: ${email} Pass: ${pass} Regauth: ${auth}`);

        let headers = new Headers();
        headers.append("Authorization", "Bearer " + auth);
        headers.append("Content-Type", "application/json");
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

        fetch(base + "/api/auth/rzm", requestOptions)
            .then(response => response.json())
            .then(data => {
                $("#btn_login").html('Login to Dashboard')
                if (data.status == true) {
                    window.location.href = "/admin/rzm-report"
                } else {
                    Swal.fire(
                        'Error',
                        data.response,
                        'error'
                    )
                }

            })
            .catch(error => console.log('error', error));

    })

    /**
     * get url ID
     */
    function getid() {
        var segment_str = window.location.pathname
        var segment_array = segment_str.split('/')
        var last_segment = segment_array.pop()
        return last_segment
    }

}) // Jquery Ready


$(document).on("click", ".cred", function () {
    let zoneid = $(this).data('id');
    $("#add_cred_zoneid").val(zoneid)
    $("#status_zoneid").val(zoneid)
})

$(document).on("click", ".status", function () {
    let zoneid = $(this).data('id')
    $("#status_zoneid").val(zoneid)
});