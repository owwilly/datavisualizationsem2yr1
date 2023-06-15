<?php

declare (strict_types = 1);

namespace LW;

final class groups {

    const URL = "https://cimspaces.nyc3.cdn.digitaloceanspaces.com/groups.json?v=";
    private $data;

    public function __construct() {
        $folder = 'data';
        $filename = $folder . '/groups.json';

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
        $this->data = json_decode($json, true);
    }

    /**
     * It returns an array of all the group names in the data (irrespective of the zone)
     * @return An array of group names.
     */
    public function getAllGroupNames() {
        $groupNames = array();
        foreach ($this->data as $group) {
            $groupNames[] = $group->group_name;
        }
        return $groupNames;
    }

    /**
     * count all data
     * (all the data(jsonobjects) in the json file)
     */
    public function countData(): int {
        return count($this->data);
    }

    /**
     * return all the data as a multi dimensional array
     */
    public function getData(): array{
        return $this->data;
    }

    /**
     * It loops through all the groups and returns the ones that match the zone id
     * @param zoneId The ID of the zone you want to get the groups for.
     * @return An array of objects.
     */
    public function getGroupsByZoneId($zoneId) {
        $groups = [];
        foreach ($this->data as $group) {
            if ($group["zone_id"] == $zoneId) {
                $groups[] = $group;
            }
        }

        return $groups;
    }

/**
 * It returns the group with the given group ID, or null if no such group existsc
 * @param groupId The ID of the group you want to find.
 * @return The group with the matching group_id
 */
    public function findGroup($groupId) {
        foreach ($this->data as $group) {
            if ($group['group_id'] === $groupId) {
                return true;
            }
        }
        return false;
    }

/**
 * find the zone which a group belongs to
 * @param groupId The group ID of the group you want to find the zone of.
 * @return The zone id of the group id that is passed in.
 */
    public function findGroupZone($groupId) {
        foreach ($this->data as $group) {
            if ($group['group_id'] === $groupId) {
                $zone = $group['zone_id'];
                return $zone;
            }
        }
        return false;
    }

}

?>