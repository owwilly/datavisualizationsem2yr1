$(document).ready(function () {
    var headers = new Headers()
    headers.append("Content-Type", "application/json")

    var getUrl = window.location
    var base = getUrl.protocol + "//" + getUrl.host
    var PATH = base
    const API = {
      all_monthly_payments_data: "/api/groups/all_monthly_payments_data",
      successful_counter: "/api/groups/successfulcounter",
      enlistment_counter: "/api/groups/enlistmentcounter",
      souls_counter: "/api/groups/soulscounter",
      successful_payments: "/api/groups/successfulpayments",
      distribution_counter: "/api/groups/distributioncounter",
      distribution_counter_rorapp: "/api/groups/rorappdistributioncounter"
    }

    const endpoints = {
      successful_payments: "https://ambassador.rhapsodyofrealities.org/api/zone/successfulpayments",
      distribution_counter: "https://distribution.rhapsodyofrealities.org/api/rin/count",
    }

    /**
     * restrict group stats away from group creation page
    */
    if (['/group-admin/groups'].indexOf(PATH) < 0) {
        GetZonalSuccessfulPayments()
        GetZonalEnlistment()
        GetZonalSouls()
        GetZonalDistribution()
    }
    // cors()
    /*
     * create group function
     */
    let btn_create_group = document.getElementById('btn_create_group')
    if (btn_create_group) {
        document.querySelector('#btn_create_group').addEventListener('click', (e) => {
            let gp_name = document.querySelector("#group_name").value,
                zoneid = document.querySelector("#group_id").value
            if (gp_name) {
                CreateGroup(gp_name, zoneid)
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
     * create a new group
     */
    function CreateGroup(gp_name, zoneid) {
        $("#btn_create_group").html('<i class="fa fa-spin fa-spinner"></i>  Creating Group')
        let raw = JSON.stringify({
            "group_name": gp_name,
            "zone_id": zoneid
        })

        let options = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        }

        fetch(base + "/api/group/create", options)
            .then(response => response.json())
            .then(result => { 
                if (result.status == true) {
                    $("#btn_create_group").html('<i class="fa fa-spin fa-spinner"></i>  Refreshing ...')
                    window.location.reload()
                    // window.location.href = "/zonal-admin/groups" //+ zoneid
                } else {
                    $("#btn_create_group").html('Save Group')
                    Swal.fire(
                        'Error',
                        result.response,
                        'error'
                    )
                }
            })
            .catch(error => console.log('error', error));
    }

    let btn_create_church = document.querySelector("#btn_create_church")
    if (btn_create_church) {
        btn_create_church.addEventListener('click', function () {
            let church_name = document.querySelector("#church_name").value,
                zoneid = document.querySelector("#church_zone_id").value,
                groupid = document.querySelector("#church_group_id").value
            if (church_name && groupid) {
                CreateChurch(groupid, zoneid, church_name)
            } else {
                Swal.fire(
                    'Error',
                    'All fields are compulsory',
                    'error'
                )
            }

        })
    }



    function CreateChurch(groupid, zoneid, church_name) {
        $("#btn_create_church").html('<i class="fa fa-spin fa-spinner"></i>  Creating Church')
        let raw = JSON.stringify({
            "group_id": groupid,
            "group_id": zoneid,
            "church_name": church_name
        })

        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        }

        fetch(base + "/api/church/create", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status == true) {
                    $("#btn_create_church").html('<i class="fa fa-spin fa-spinner"></i>  Refreshing ...')
                    window.location.reload()
                } else {
                    $("#btn_create_church").html('Save Church')
                    Swal.fire(
                        'Error',
                        result.response,
                        'error'
                    )
                }
            })
            .catch(error => console.log('error', error));
    }

    /*
     * logout function
     */
    let btn_logout = document.querySelector("#btn_logout")
    if (btn_logout) {
        btn_logout.addEventListener('click', function () {
            Logout()
        })
    }

    function Logout() {
        let zone = document.querySelector("#slug_").value
        if (zone) {
            let raw = JSON.stringify({
                "zone": zone
            })

            let requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
                redirect: 'follow'
            }

            fetch(base + "/api/zonal-admin/logout", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if(result.status == true){
                        window.location.href = "/" 
                    }
                })
                .catch(error => console.log('error', error));
        }
    }


    /*
     * Get total successful payments 
     */
    function GetZonalSuccessfulPayments() {
      groupid = document.querySelector("#slug_").value
      $("#total_success_group").html('<i class="fa fa-spin fa-spinner"></i>  Loading ...')
      let raw = JSON.stringify({
          "group_id": groupid
      })

      let requestOptions = {
        method: 'POST',
        headers: headers,
        body: raw,
        redirect: 'follow'
      }

      fetch(base + API.successful_payments, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == true) {
            document.querySelector("#total_success_group").innerHTML = result.response+' USD';
        }
      })
      .catch(error => console.log('error', error))

    }

    /*
     * Get total failed payments 
     */
    function GetZonalEnlistment() {
      groupid = document.querySelector("#slug_").value
      $("#total_enlistment_group").html('<i class="fa fa-spin fa-spinner"></i>  Loading ...')
      let raw = JSON.stringify({
          "group_id": groupid
      })

      let requestOptions = {
        method: 'POST',
        headers: headers,
        body: raw,
        redirect: 'follow'
      }

      fetch(base + API.enlistment_counter, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == true) {
            document.querySelector("#total_enlistment_group").innerHTML = result.response;
        }
      })
      .catch(error => console.log('error', error))

    }

    /*
     * Get total rinofficial for this year
     */
    function GetZonalSouls() {
      groupid = document.querySelector("#slug_").value
      $("#total_souls_group").html('<i class="fa fa-spin fa-spinner"></i>  Loading ...')
      let raw = JSON.stringify({
          "group_id": groupid
      })

      let requestOptions = {
        method: 'POST',
        headers: headers,
        body: raw,
        redirect: 'follow'
      }

      fetch(base + API.souls_counter, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == true) {
            document.querySelector("#total_souls_group").innerHTML = result.response;
        }
      })
      .catch(error => console.log('error', error))

    }

    /*
     * Get total rinofficial for this year
     */
    function GetZonalDistribution() {
      groupid = document.querySelector("#slug_").value
      $("#total_distribution_group").html('<i class="fa fa-spin fa-spinner"></i>  Loading ...')
      let raw = JSON.stringify({
          "group_id": groupid
      })

      let requestOptions = {
        method: 'POST',
        headers: headers,
        body: raw,
        redirect: 'follow'
      }

        fetch(base + API.distribution_counter_rorapp, requestOptions)
        .then(response => response.json())
        .then(data => {
            fetch(base + API.distribution_counter, requestOptions)
            .then(response => response.json())
            .then(result => {
                var total = parseInt(result.response)+parseInt(data.response);
                document.querySelector("#total_distribution_group").innerHTML = total;
            })
            .catch(error => console.log('error', error));                    
        })
        .catch(error => console.log('error', error))

    }


    /*
    * disable CORS policy for api fetch requests
    */ 
    function cors(){
        if (typeof _SERVER['HTTP_ORIGIN'] !== 'undefined') {
            header("Access-Control-Allow-Origin: {_SERVER['HTTP_ORIGIN']}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');
        }
        if (_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            if (typeof _SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] !== 'undefined') {
                header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
            }
            if (typeof _SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'] !== 'undefined') {
                header("Access-Control-Allow-Headers: {_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
            }
            exit(0);
        }    
    }

    /**
     * get url ID
     */
    function getid() {
        var segment_str = window.location.pathname
        var segment_array = segment_str.split('/')
        var last_segment = segment_array.pop()
        return last_segment
    }


})

