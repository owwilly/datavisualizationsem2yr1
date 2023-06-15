<?php

declare (strict_types = 1);

namespace LW;

final class zones {

    const URL = "https://cimspaces.nyc3.cdn.digitaloceanspaces.com/zones.json?v=";
    private $zones;

    public function __construct() {  

        $folder = 'data';
        $filename = $folder . '/zones.json';

        if (!is_dir($folder)) {
            // if the folder does not exist, create it
            mkdir($folder);
        }

        if (file_exists($filename)) {
            $age = time() - filemtime($filename);

            if ($age > 86400) {
                // if the file is older than 24 hours, delete it
                unlink($filename);

                // fetch the contents from the URL and save to file 
                $url = self::URL . microtime(true);
                $json = file_get_contents($url);
                file_put_contents($filename, $json);
            } else { 
                // if the file is not older than 24 hours, read the contents from the file
                $json = file_get_contents($filename);
            }
        } else { 
            // if the file does not exist, fetch the contents from the URL and save to file
            $url = self::URL . microtime(true);
            $json = file_get_contents($url);
            file_put_contents($filename, $json);
        }

        $this->zones = json_decode($json, true);

    }

    /**
     * returns an array of all the zonal names
     * @return An array of zonal names.
     */
    public function getZonalNames(): array{
        $zonalNames = [];
        foreach ($this->zones as $zone) {
            array_push($zonalNames, $zone['zonal_name']);
        }
        return $zonalNames;
    }

    /**
     * count all zones
     */
    public function countZones(): int {
        return count($this->zones);
    }

    /**
     * return all the data
     */
    public function getZones(): array{
        return $this->zones;
    }

    /**
     * Search through the zones array for a zone with a matching zone_id
     * @param zone_id The ID of the zone you want to search for.
     * @return The zone object that matches the zone_id
     */
    public function findZone($zone_id) {
        foreach ($this->zones as $zone) {
            if ($zone['zone_id'] === $zone_id) {
                return $zone;
            }
        }
        return null;
    }

}

?>