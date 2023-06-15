# README #

**[Initialization](#Initialization)** <br>
**[Return all Zonal Names](#return-all-zonal-names)** <br>
**[Count all zones](#count-all-zones)** <br>
**[Return All the Data](#return-all-the-data)** <br>
**[Search Zone id](#Search-through-the-zones-by-zone-id)** <br>
**[Array of Group Names](#array-of-group-names)** <br>
**[Total Number of All Groups](#total-number-of-all-groups)** <br>
**[All The Groups Data](#all-the-groups-data)** <br>
**[Returns the Groups Matching in the Zoneid](#returns-the-groups-matching-in-the-zoneid)** <br>
**[Get churches in specific Group](#Get-churches-in-specific-group)** <br>
**[Returns Number of Churches in Specific Group](#returns-number-of-churches-in-specific-group)** <br>



### Add the following lines of code below to your composer.json file:
```
{
    "repositories": [
        {
            "type": "vcs",
            "url":  "https://github.com/cim-engineering/lw-zones"
        }
    ],
    "require": {
        "cim/lw-zones": "dev-main"
    }
}
```
### Run a composer update command 

``` composer update package ```

## Usage
### Loading
```php
 namespace LW ;

 use LW\zones;
 use LW\groups;
 use LW\churches;
 ```
### Initialization
Simple initialization

```php
 $zone = new zones(); 
 $group = new groups();
 $church = new churches();
 ```

### return all zonal names

returns an array of all the zonal names
  ```php
  $zone->getZonalNames();
  ```

  ### count all zones
  returns an int type as a total number all of the zones
  ```php
  $zone->countAllZones();
  ```

###  return all the data
returns an array  of all the keys and zone names

```php
$zone->getZones();
```
example :
```php
//return all zone ids
foreach($zone->getZones() as $id ){
    echo id['zone_id']; 
}

//return all zone names
foreach($zone->getZones() as $names ){
    echo $names['zonal_name']; 
}
```

### Search through the zones by zone id

Search through the zones array for a zone with a matching zone_id

```php
$zone->findZone($zone_id); 
```
example :
```php
  $id = 'lvz'; 
  if($zone->findZone($id)){ 
    echo 'this zone exists';  //returns true
  }
```
### array of group names.
It returns an array of all the group names in the data (irrespective of the zone)

```php
$group->getAllGroupNames();
```

### total number of all groups
(all the data(jsonobjects) in the json file).
Returns a total of all the groups

```php
$group->countData();
```

### all the groups data
returns all the groups data as a multi dimensional array

```php
$group->getData();
```


### returns the groups matching in the zoneid

It loops through all the groups and returns the ones that match the zone id 
```php
$group->getGroupsByZoneId($zoneId);
```

### Get churches in specific group

 It takes a group id and returns an array of churches that belong to that group
 return An array of churches that belong to a specific group.
```php
$church->getChurchesByGroupId($groupId)
```

### returns number of churches in specific group

 It takes a group id and returns a total value of churches that belong to that group

```php
$church->countChurchesByGroupId($groupId)
```