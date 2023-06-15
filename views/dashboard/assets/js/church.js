$(document).ready(function () {
    var headers = new Headers()
    headers.append("Content-Type", "application/json")

    var getUrl = window.location
    var base = getUrl.protocol + "//" + getUrl.host
    var PATH = base
    const API = {
      all_monthly_payments_data: "/api/churches/all_monthly_payments_data",
      successful_counter: "/api/churches/successfulcounter",
      enlistment_counter: "/api/churches/enlistmentcounter",
      souls_counter: "/api/churches/soulscounter",
      successful_payments: "/api/churches/successfulpayments",
      distribution_counter: "/api/churches/distributioncounter",
      distribution_counter_rorapp: "/api/churches/rorappdistributioncounter",
    }

    const endpoints = {
      successful_payments: "https://ambassador.rhapsodyofrealities.org/api/zone/successfulpayments",
      distribution_counter: "https://distribution.rhapsodyofrealities.org/api/rin/count",
    }

    /**
     * restrict church stats away from church creation page
    */
    if (['/church-admin/churches', '/group-admin/churches', '/zonal-admin/churches'].indexOf(PATH) < 0) {
      GetZonalSuccessfulPayments()
      GetZonalEnlistment()
      GetZonalSouls()
      GetZonalDistribution()
    }

    /*
     * create group function
     */
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
            "zone_id": zoneid,
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
                console.log(result)
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
      churchid = document.querySelector("#slug_").value
      $("#total_success_church").html('<i class="fa fa-spin fa-spinner"></i>  Loading ...')
      let raw = JSON.stringify({
          "church_id": churchid
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
            document.querySelector("#total_success_church").innerHTML = result.response+' USD';
        }
      })
      .catch(error => console.log('error', error))

    }

    /*
     * Get total failed payments 
     */
    function GetZonalEnlistment() {
      churchid = document.querySelector("#slug_").value
      $("#total_enlistment_church").html('<i class="fa fa-spin fa-spinner"></i>  Loading ...')
      let raw = JSON.stringify({
          "church_id": churchid
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
            document.querySelector("#total_enlistment_church").innerHTML = result.response;
        }
      })
      .catch(error => console.log('error', error))

    }

    /*
     * Get total rinofficial for this year
     */
    function GetZonalSouls() {
      churchid = document.querySelector("#slug_").value
      $("#total_souls_church").html('<i class="fa fa-spin fa-spinner"></i>  Loading ...')
      let raw = JSON.stringify({
          "church_id": churchid
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
            document.querySelector("#total_souls_church").innerHTML = result.response;
        }
      })
      .catch(error => console.log('error', error))

    }

    /*
     * Get total rinofficial for this year
     */
    function GetZonalDistribution() {
      churchid = document.querySelector("#slug_").value
      $("#total_distribution_church").html('<i class="fa fa-spin fa-spinner"></i>  Loading ...')
      let raw = JSON.stringify({
          "church_id": churchid
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
            var old_total = result.response;
            document.querySelector("#total_distribution_church").innerHTML = parseInt(data.response)+parseInt(old_total);
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




