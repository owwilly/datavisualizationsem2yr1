<nav class="sidebar">
      <div class="sidebar-header">
        <a href="#" class="sidebar-brand">
          QUALITY<span> ANALYSIS</span>
        </a>
        <div class="sidebar-toggler not-active">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="sidebar-body">
        <ul class="nav">
          <li class="nav-item nav-category">Main</li>
          <li class="nav-item">
          <a href="/" class="nav-link">
               <i class="mdi mdi-view-dashboard"></i>
              <span class="link-title">Dashboard</span>
            </a>
          </li>
          <?php 
            /*
            * include data files
            */
            foreach (glob(DATABASEPATH . "*.csv") as $dataset):
              $link = str_replace(".csv","",$dataset);
              $link = str_replace(DATABASEPATH,"",$link);
              ?>
              <li class="nav-item">
                <a href="/<?= $link ?>" class="nav-link">
                  <i class="mdi mdi-view-dashboard"></i>
                  <span class="link-title"><?= $link.' Data' ?></span>
                </a>
              </li>
              <?php
              endforeach;
          ?>

        </ul>
      </div>
    </nav>