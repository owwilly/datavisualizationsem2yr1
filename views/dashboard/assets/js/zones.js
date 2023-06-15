$(document).ready(function () {
    var headers = new Headers()
    headers.append("Content-Type", "application/json")

    var getUrl = window.location
    var base = getUrl.protocol + "//" + getUrl.host
    const API = {
      all_monthly_payments_data: "/api/zones/all_monthly_payments_data",
      successful_counter: "/api/zones/successfulcounter",
      enlistment_counter: "/api/zones/enlistmentcounter",
      souls_counter: "/api/zones/soulscounter",
      successful_payments: "/api/zones/successfulpayments",
      distribution_counter: "/api/zones/distributioncounter",
      distribution_counter_rorapp: "/api/zones/rorappdistributioncounter"
    }

    const endpoints = {
      successful_payments: "https://ambassador.rhapsodyofrealities.org/api/zone/successfulpayments",
      distribution_counter: "https://distribution.rhapsodyofrealities.org/api/rin/count",
      ZONALDRIBUTION: "http://app.rhapsodyofrealities.org/v1/stats/fetch/"
    }

    GetZonalSuccessfulPayments()
    GetZonalEnlistment()
    GetZonalSouls()
    GetZonalDistribution()

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
                        window.location.href = "/zone/" + zone
                    }
                })
                .catch(error => console.log('error', error));
        }
    }


    /*
     * Get total successful payments 
     */
    function GetZonalSuccessfulPayments() {
      zoneid = document.querySelector("#slug_").value
      $("#total_success_zone").html('<i class="fa fa-spin fa-spinner"></i>  Loading ...')
      let raw = JSON.stringify({
          "zone_id": zoneid
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
            document.querySelector("#total_success_zone").innerHTML = result.response+' USD';
        }
      })
      .catch(error => console.log('error', error))

    }

    /*
     * Get total failed payments 
     */
    function GetZonalEnlistment() {
      zoneid = document.querySelector("#slug_").value
      $("#total_enlistment_zone").html('<i class="fa fa-spin fa-spinner"></i>  Loading ...')
      let raw = JSON.stringify({
          "zone_id": zoneid
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
            document.querySelector("#total_enlistment_zone").innerHTML = result.response;
        }
      })
      .catch(error => console.log('error', error))

    }

    /*
     * Get total rinofficial for this year
     */
    function GetZonalSouls() {
      zoneid = document.querySelector("#slug_").value
      $("#total_souls_zone").html('<i class="fa fa-spin fa-spinner"></i>  Loading ...')
      let raw = JSON.stringify({
          "zone_id": zoneid
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
            document.querySelector("#total_souls_zone").innerHTML = result.response;
        }
      })
      .catch(error => console.log('error', error))

    }

    /*
     * Get total rinofficial for this year
     */
    function GetZonalDistribution() {
      let zoneid  = document.querySelector("#slug_").value
      $("#total_distribution_zone").html('<i class="fa fa-spin fa-spinner"></i>  Loading ...')
      let raw = JSON.stringify({
          "zone_id": zoneid
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
        console.log(data)
        fetch(base + API.distribution_counter, requestOptions)
        .then(response => response.json())
        .then(result => {
            var old_total = result.response;
            document.querySelector("#total_distribution_zone").innerHTML = parseInt(data.response)+parseInt(old_total);
        })
        .catch(error => console.log('error', error));                            
      })
      .catch(error => console.log('error', error))

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