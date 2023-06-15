<?php

/**
 * This code was generated by
 * \ / _    _  _|   _  _
 * | (_)\/(_)(_|\/| |(/_  v1.0.0
 * /       /
 */

namespace Twilio\Rest\Proxy\V1;

use Twilio\Deserialize;
use Twilio\Exceptions\TwilioException;
use Twilio\InstanceResource;
use Twilio\Options;
use Twilio\Rest\Proxy\V1\Service\PhoneNumberList;
use Twilio\Rest\Proxy\V1\Service\SessionList;
use Twilio\Rest\Proxy\V1\Service\ShortCodeList;
use Twilio\Values;
use Twilio\Version;

/**
 * PLEASE NOTE that this class contains beta products that are subject to change. Use them with caution.
 *
 * @property string $sid
 * @property string $uniqueName
 * @property string $accountSid
 * @property string $chatInstanceSid
 * @property string $callbackUrl
 * @property int $defaultTtl
 * @property string $numberSelectionBehavior
 * @property string $geoMatchLevel
 * @property string $interceptCallbackUrl
 * @property string $outOfSessionCallbackUrl
 * @property \DateTime $dateCreated
 * @property \DateTime $dateUpdated
 * @property string $url
 * @property array $links
 */
class ServiceInstance extends InstanceResource {
    protected $_sessions;
    protected $_phoneNumbers;
    protected $_shortCodes;

    /**
     * Initialize the ServiceInstance
     *
     * @param Version $version Version that contains the resource
     * @param mixed[] $payload The response payload
     * @param string $sid The unique string that identifies the resource
     */
    public function __construct(Version $version, array $payload, string $sid = null) {
        parent::__construct($version);

        // Marshaled Properties
        $this->properties = [
            'sid' => Values::array_get($payload, 'sid'),
            'uniqueName' => Values::array_get($payload, 'unique_name'),
            'accountSid' => Values::array_get($payload, 'account_sid'),
            'chatInstanceSid' => Values::array_get($payload, 'chat_instance_sid'),
            'callbackUrl' => Values::array_get($payload, 'callback_url'),
            'defaultTtl' => Values::array_get($payload, 'default_ttl'),
            'numberSelectionBehavior' => Values::array_get($payload, 'number_selection_behavior'),
            'geoMatchLevel' => Values::array_get($payload, 'geo_match_level'),
            'interceptCallbackUrl' => Values::array_get($payload, 'intercept_callback_url'),
            'outOfSessionCallbackUrl' => Values::array_get($payload, 'out_of_session_callback_url'),
            'dateCreated' => Deserialize::dateTime(Values::array_get($payload, 'date_created')),
            'dateUpdated' => Deserialize::dateTime(Values::array_get($payload, 'date_updated')),
            'url' => Values::array_get($payload, 'url'),
            'links' => Values::array_get($payload, 'links'),
        ];

        $this->solution = ['sid' => $sid ?: $this->properties['sid'], ];
    }

    /**
     * Generate an instance context for the instance, the context is capable of
     * performing various actions.  All instance actions are proxied to the context
     *
     * @return ServiceContext Context for this ServiceInstance
     */
    protected function proxy(): ServiceContext {
        if (!$this->context) {
            $this->context = new ServiceContext($this->version, $this->solution['sid']);
        }

        return $this->context;
    }

    /**
     * Fetch the ServiceInstance
     *
     * @return ServiceInstance Fetched ServiceInstance
     * @throws TwilioException When an HTTP error occurs.
     */
    public function fetch(): ServiceInstance {
        return $this->proxy()->fetch();
    }

    /**
     * Delete the ServiceInstance
     *
     * @return bool True if delete succeeds, false otherwise
     * @throws TwilioException When an HTTP error occurs.
     */
    public function delete(): bool {
        return $this->proxy()->delete();
    }

    /**
     * Update the ServiceInstance
     *
     * @param array|Options $options Optional Arguments
     * @return ServiceInstance Updated ServiceInstance
     * @throws TwilioException When an HTTP error occurs.
     */
    public function update(array $options = []): ServiceInstance {
        return $this->proxy()->update($options);
    }

    /**
     * Access the sessions
     */
    protected function getSessions(): SessionList {
        return $this->proxy()->sessions;
    }

    /**
     * Access the phoneNumbers
     */
    protected function getPhoneNumbers(): PhoneNumberList {
        return $this->proxy()->phoneNumbers;
    }

    /**
     * Access the shortCodes
     */
    protected function getShortCodes(): ShortCodeList {
        return $this->proxy()->shortCodes;
    }

    /**
     * Magic getter to access properties
     *
     * @param string $name Property to access
     * @return mixed The requested property
     * @throws TwilioException For unknown properties
     */
    public function __get(string $name) {
        if (\array_key_exists($name, $this->properties)) {
            return $this->properties[$name];
        }

        if (\property_exists($this, '_' . $name)) {
            $method = 'get' . \ucfirst($name);
            return $this->$method();
        }

        throw new TwilioException('Unknown property: ' . $name);
    }

    /**
     * Provide a friendly representation
     *
     * @return string Machine friendly representation
     */
    public function __toString(): string {
        $context = [];
        foreach ($this->solution as $key => $value) {
            $context[] = "$key=$value";
        }
        return '[Twilio.Proxy.V1.ServiceInstance ' . \implode(' ', $context) . ']';
    }
}