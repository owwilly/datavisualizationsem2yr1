<?php
declare (strict_types = 1);

namespace LW;

final class churches {

    const URL = "https://cimspaces.nyc3.cdn.digitaloceanspaces.com/churches.json?v=";
    private $json;

    public function __construct() {

        $folder = 'data';
        $filename = $folder . '/churches.json';

        if (!is_dir($folder)) {
            mkdir($folder);
        }

        if (file_exists($filename)) {
            $age = time() - filemtime($filename);
            if ($age > 86400) {
                unlink($filename);
                $url = self::URL . microtime(true);
                $json = file_get_contents($url);
                file_put_contents($filename, $json);
            } else {
                $json = file_get_contents($filename);
            }
        } else {
            $url = self::URL . microtime(true);
            $json = file_get_contents($url);
            file_put_contents($filename, $json);
        }
        $this->json = json_decode($json, true);
    }

/**
 * It takes a group id and returns an array of churches that belong to that group
 * @param groupId The id of the group you want to get the churches for.
 * @return An array of churches that belong to a specific group.
 */
    public function getChurchesByGroupId($groupId): array{
        $churches = [];
        foreach ($this->json as $church) {
            if ($church['group_id'] == $groupId) {
                array_push($churches, array(
                    'church_id' => $church['church_id'],
                    'church_name' => $church['church_name'],
                ));
            }
        }
        return $churches;
    }

    public function countChurchesByGroupId($groupId) {
        $result = $this->getChurchesByGroupId($groupId);
        return (is_countable($result) ? $result : []);
    }

    /**
     * return all the data as a multi dimensional array
     */
    public function getData(): array{
        return $this->json;
    }

    /**
     * find the zone a church belongs to
     * @param churchID the id of the church
     * @return zoneID the zone the church belongs to
     */
    public function findChurchZone($churchID) {
        foreach ($this->json as $church) {
            if ($church['church_id'] === $churchID) {
                $zone = $church['zone_id'];
                return $zone;
            }
        }
        return false;
    }

    /**
     * find the group a church belongs to
     * @param churchID the id of the church
     * @return groupID the group the church belongs to
     */
    public function findChurchGroup($churchID) {
        foreach ($this->json as $church) {
            if ($church['church_id'] === $churchID) {
                $group = $church['group_id'];
                return $group;
            }
        }
        return false;
    }

}

?>