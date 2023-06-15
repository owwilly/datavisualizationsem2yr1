<?php 
  define("BASE", "/views/dashboard/"); 
  define("DATABASEPATH", "views/dashboard/data/");  
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title> Owor Car | Statistics </title>
  <link rel="stylesheet" href="<?= BASE ?>assets/vendors/core/core.css">
  <link rel="stylesheet" href="<?= BASE ?>assets/vendors/bootstrap-datepicker/bootstrap-datepicker.min.css">
  <link rel="stylesheet" href="<?= BASE ?>assets/fonts/feather-font/css/iconfont.css">
  <link rel="stylesheet" href="<?= BASE ?>assets/vendors/flag-icon-css/css/flag-icon.min.css">
  <link rel="stylesheet" href="<?= BASE ?>assets/css/demo_1/style.css">
  <link rel="shortcut icon" href="https://rhapsodyofrealities.b-cdn.net/rin/assets/logoblack21.png" />

  <link rel="stylesheet" href="<?= BASE ?>assets/vendors/mdi/css/materialdesignicons.min.css">
  <link rel="stylesheet" href="<?= BASE ?>assets/fonts/feather-font/css/iconfont.css">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css">

  <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"> -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>


</head>

<style>
        h3,
        .h3 {
          font-size: 30px;
        }

        .card .card-title {
          color: #3f51b5;
        }

        .newheader {
          color: #3f51b7;
          font-size: 20px;
          text-transform: uppercase;
          font-weight: 900;
        }

/* 
    Visualization Styles
 */
        #mainWrapper {
            height: auto;
            width: 100%;
            /* overflow-x:auto; */
        }

        #graphs{
          margin-top: 20px;
        }

        #selectionPane {
            /* position: absolute; */
            top: 50px;
            left: 300px;
            height: 40px;
            font-size: 18px;
        }

        #bubbleChart {
            /* position: absolute; */
            /* top: 200px; */
            left: 10px;
            width: 150px;
            height: 400px;
            margin-bottom: 50px;
            margin-top: 50px;
        }



        #histogram {
            /* position: absolute; */
            /* top: 100px; */
            left: 10px;
            width: 150px;
            height: 400px;
            margin-bottom: 50px;
            margin-top: 50px;
        }

        #histogram_label {
            /* position: absolute; */
            /* top: 510px; */
            left: 10px;
            width: 200px;
        }

        #connectedScatter {
            /* position: absolute; */
            /* top: 600px; */
            left: 10px;
            width: 100px;
            height: 400px;
            margin-bottom: 50px;
            margin-top: 50px;
        }

        #heatmap {
            /* position: absolute; */
            /* top: 600px; */
            left: 10px;
            width: 100px;
            height: 800px;
            margin-bottom: 50px;
            margin-top: 50px;
        }


        .slice {
            font-size: 12pt;
            font-family: Verdana;
            fill: white;
            /*svg specific - instead of color*/
            font-weight: bold;
        }

        /*for line chart*/
        .axis path,
        .axis line {
            fill: none;
            stroke: black;
            shape-rendering: crispEdges;
            /*The shape-rendering property is an SVG attribute, used here to make sure our axis and its tick mark lines are pixel-perfect. */
        }

        .line {
            fill: none;
            /*stroke: steelblue;*/
            stroke-width: 3px;
        }

        .dot {
            /*fill: white;*/
            /*stroke: steelblue;*/
            stroke-width: 1.5px;
        }


        .axis text {
            font-family: Verdana;
            font-size: 11px;
        }

        .title {
            font-family: Verdana;
            font-size: 15px;
            margin-bottom: 5px;

        }

        .xAxis {
            font-family: verdana;
            font-size: 11px;
            fill: black;
        }

        .yAxis {
            font-family: verdana;
            font-size: 11px;
            fill: white;
        }


        table {
            border-collapse: collapse;
            border: 0px;
            font-family: Verdana;
            color: #5C5558;
            font-size: 12px;
            text-align: right;
        }

        td {
            padding-left: 10px;
        }

        #histogramTitle1 {
            font-family: Verdana;
            font-size: 14px;
            fill: lightgrey;
            text-anchor: middle;
        }

        #histogramTitle2 {
            font-family: Verdana;
            font-size: 72px;
            fill: grey;
            text-anchor: middle;

            /*font-style: italic;*/
        }

</style>

<body>
  <div class="main-wrapper">
    <?php include 'parts/sidenav.php'; ?>

    <div class="page-wrapper">
      <nav class="navbar">
        <a href="#" class="sidebar-toggler">
          <i data-feather="menu"></i>
        </a>
        <div class="navbar-content">
          <form class="search-form">
            <div class="input-group">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  <i data-feather="search"></i>
                </div>
              </div>
              <input type="text" class="form-control" placeholder="Search here...">
            </div>
          </form>
          <ul class="navbar-nav">
            <!-- top menu !-->
          </ul>
        </div>
      </nav>
      <!-- partial -->

      <div class="page-content">

        <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
          <div>
            <h4 class="mb-3 mb-md-0 newheader">Owor Wilbroad Water Quality Analysis Admin Dashboard </h4>
            <span style="color:red; font-size: 13px;"> <strong> ALL DATA / RECORDS  WILL BE VERIFIED</strong> </span>
          </div>
          <div class="d-flex align-items-center flex-wrap text-nowrap">
          </div>
        </div>

        <div class="row">
          <div class="col-12 col-xl-12 stretch-card">
            <div class="row flex-grow"> 

              <div class="col-md-4 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <p>Interactivity of Individual Visualizations</p><p>

                        1. Bubble Chart: Brushing with zooming</p><p>

                        2. Histogram: Changing number of bins</p><p>

                        3. Connected Scatter Plot: Using selection buttons</p><p>

                        <!-- 4. Heatmap: Labelling</p> -->
                  
                  </div>
                </div>
              </div>    
              

            </div>
          </div>
        </div>

        
        
        <div class="row" style="margin-top:10px">
          <div class="col-lg-7 col-xl-12 stretch-card">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-baseline mb-2">
                  <h4 class="card-title"> Water Quality Statistical Data </h4>  
                    <input type="hidden" id="district" value="<?= $slug?>" >                
                    <div id="selectionPane">
                        <label for="origin"><strong>Source Name Statistics:</strong></label>
                        <select id="selectOrigin">
                            <option value="allOrigin" selected><?= $slug?> District Water Quality Data</option>
                        </select>
                    </div>
                  <!-- <a href="#" id="btn_export_zonal_data"  class="btn btn-info">Export Data</a> -->
                </div>

                <div class="table-responsive">
                  <div id="mainWrapper">


                    <div id="graphs">
                      <div id="histogram"></div>
                      <div id="histogram_label">
                          <p>
                              <label>Change number of bins</label>
                              <input type="number" min="1" max="100" step="10" value="10" id="nBin">
                          </p>
                      </div>
                      <br>
                      <div id="bubbleChart"></div>
                      <br>
                      <div id="connectedScatter"></div>
                      <!-- <br>
                      <div id="heatmap"></div> -->

                    </div>

                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>


      </div>

      <!-- partial:partials/_footer.html -->
      <footer class="footer d-flex flex-column flex-md-row align-items-center justify-content-between">
        <p class="text-muted text-center text-md-left">Copyright © <?= date("Y") ?> <a href="#"> Owor Wilbroad REG: 2022/HD05/1450U </a>. All rights reserved</p>
      </footer>
      <!-- partial -->

    </div>
  </div>


  <!-- Load d3.js -->
  <script src="https://d3js.org/d3.v4.js"></script>
  <script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>


  <!-- core:js -->
  <script src="<?= BASE ?>assets/vendors/core/core.js"></script>
  <!-- <script src="<?= BASE ?>assets/vendors/chartjs/Chart.min.js"></script> -->
  <script src="<?= BASE ?>assets/vendors/jquery.flot/jquery.flot.js"></script>
  <script src="<?= BASE ?>assets/vendors/jquery.flot/jquery.flot.resize.js"></script>
  <!-- <script src="<?= BASE ?>assets/vendors/bootstrap-datepicker/bootstrap-datepicker.min.js"></script> -->
  <!-- <script src="<?= BASE ?>assets/vendors/apexcharts/apexcharts.min.js"></script>
  <script src="<?= BASE ?>assets/vendors/progressbar.js/progressbar.min.js"></script> -->
  <script src="<?= BASE ?>assets/vendors/feather-icons/feather.min.js"></script>
  <script src="<?= BASE ?>assets/js/dashboard.js"></script>
  <!-- <script src="<?= BASE ?>assets/js/datepicker.js"></script> -->
  <!-- <script src="<?= BASE ?>assets/vendors/datatables.net/jquery.dataTables.js?id=<?= microtime() ?>"></script>
  <script src="<?= BASE ?>assets/vendors/datatables.net-bs4/dataTables.bootstrap4.js?id=<?= microtime() ?>"></script> -->
  <script src="<?= BASE ?>assets/vendors/feather-icons/feather.min.js?id=<?= microtime() ?>"></script>
  <script src="<?= BASE ?>assets/js/template.js?id=<?= microtime() ?>"></script>
  <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.js" integrity="sha512-JjYSgzqo9K0IeYGEslMRYE8aO9tq7Ky3EQNmEVkAe6Cp14AwlJMLMnb0fpgEkr3YxJ8ghQiriOvZwIdRZieGIQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>   -->
  <script src="<?= BASE ?>assets/js/app.js?v=<?= microtime() ?>"></script>
</body>

</html>