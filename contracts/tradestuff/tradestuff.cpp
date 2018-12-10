/**
 *  @file
 *  @copyright defined in eos/LICENSE.txt
 */

#include "tradestuff.hpp"

#include <vector>
#include <algorithm>
#include <cmath>

using eosio::indexed_by;
using eosio::const_mem_fun;
using eosio::asset;
using eosio::action;
using eosio::permission_level;
using std::string;

static const uint64_t NO_CHANGE = 0xffffffff;
static const uint64_t HOURS_IN_DAY = 24;
static const uint64_t MINUTES_IN_HOUR = 60;
static const uint64_t SECONDS_IN_MIN = 60;

//@abi action
void tradestuff::acctadd(const account_name username,
                 const std::string& avatar,
                 const std::string& city,
                 const std::string& country,
                 const std::string& state,
                 const std::string& zip) {

    // if not authorized then this action is aborted and transaction is rolled back
    // any modifications by other actions are undone
    require_auth(username); // make sure authorized by account

    // address_index is typedef of our multi_index over table address
    // address table is auto "created" if needed
    account_index accounts(_self, _self); // code, scope

    // verify does not already exist
    // multi_index find on primary index which in our case is account
    auto user_index = accounts.get_index<N(username)>();
    auto itr = user_index.find(username);
    eosio_assert(itr == user_index.end(), "TradeStuff account already exists.");

    // Verify that fields are not blank
    eosio_assert(avatar != "", "Avatar cannot be blank.");
    eosio_assert(city != "", "City cannot be blank.");
    eosio_assert(country != "", "Country cannot be blank.");
    eosio_assert(state != "", "State cannot be blank.");
    eosio_assert(zip != "", "Zipcode cannot be blank.");

    // bill all RAM to tradestuff
    uint64_t id = accounts.available_primary_key();
    accounts.emplace(_self, [&](auto& tsa) {
        tsa.id = id;
        tsa.avatar = avatar;
        tsa.city = city;
        tsa.country = country;
        tsa.state = state;
        tsa.username = username;
        tsa.zip = zip;
        tsa.user_eos  = eosio::asset(0, S(4, EOS));
        tsa.created_at = eosio::time_point_sec(now());
    });

    // Fire inline action for ID generation
    action(
        permission_level{_self, N(active)},
        N(tradestuff), N(generateid),
        std::make_tuple(std::string("account"), id)
    ).send();
}

void tradestuff::acctupdate(const account_name username,
                    const std::string& avatar,
                    const std::string& city,
                    const std::string& country,
                    const std::string& state,
                    const std::string& zip) {

    // Account modifications require user or tradestuff auth
    if(!has_auth(_self) && !has_auth(username)) {
        eosio_assert(false, "Insufficient authority.");
    }

    account_index accounts(_self, _self); // code, scope

    // verify already exist
    auto username_index = accounts.get_index<N(username)>();
    auto user_itr = username_index.find(username);
    eosio_assert(user_itr != username_index.end(), "Failed to retrieve account by username");

    auto itr = accounts.find(user_itr->id);
    eosio_assert(itr != accounts.end(), "Failed to retrieve account by id.");

    // Get all offers

    // Get created offers
    offer_index offer(_self, _self);
    auto offer_creator_index = offer.get_index<N(creator)>();
    auto creator_itr = offer_creator_index.lower_bound(itr->id);
    std::vector<uint64_t> vOfferIds;
    for(; creator_itr->creator_id == itr->id && creator_itr != offer_creator_index.end(); creator_itr++) {
        vOfferIds.push_back(creator_itr->id);
    }
    // Get received offers
    auto offer_receiver_index = offer.get_index<N(recipient)>();
    auto receiver_itr = offer_receiver_index.lower_bound(itr->id);
    for(; receiver_itr->recipient_id == itr->id && receiver_itr != offer_receiver_index.end(); receiver_itr++) {
        vOfferIds.push_back(receiver_itr->id);
    }

    // Check all offers to see if they are in a trade
    trade_index trade(_self, _self);
    auto trade_byoffer_index = trade.get_index<N(offer)>();
    for(auto offer_itr = vOfferIds.begin(); offer_itr != vOfferIds.end(); offer_itr++) {
        auto trade_itr = trade_byoffer_index.find(*offer_itr);
        eosio_assert(trade_itr == trade_byoffer_index.end(), "Cannot update account. Account currently in a trade.");
    }
    
    accounts.modify( itr, _self /*payer*/, [&]( auto& tsa) {
        // only update fields if supplied
        if(avatar != "") { tsa.avatar = avatar; }
        if(city != "") { tsa.city = city; }
        if(country != "") { tsa.country = country; }
        if(state != "") { tsa.state = state; }
        if(zip != "") {tsa.zip = zip; }
        tsa.updated_at = eosio::time_point_sec(now());
    });

    // Inline action to delete all current offers on this account
    if(vOfferIds.size() > 0) {
        action(
            permission_level{_self, N(active)},
            N(tradestuff), N(offerdel),
            std::make_tuple(username, vOfferIds)
        ).send();
    }
}

void tradestuff::acctdel(const account_name username, uint64_t account_id) {
    // Account removals require user or tradestuff auth
    if(!has_auth(_self) && !has_auth(username)) {
        eosio_assert(false, "Insufficient authority.");
    }

    account_index accounts(_self, _self); // code, scope

    // verify already exist
    auto itr = accounts.find(account_id);
    
    eosio_assert(itr != accounts.end(), "Failed to retrieve account by id.");
    eosio_assert(itr->username == username, "Account does not belong to this user.");

    // Get stuff
    stuff_index stuff(_self, _self);
    auto stuff_account_index = stuff.get_index<N(account)>();
    auto stuff_itr = stuff_account_index.lower_bound(itr->id);
    std::vector<uint64_t> vStuffIds;
    for(; stuff_itr->account_id == itr->id && stuff_itr != stuff_account_index.end(); stuff_itr++) {
        vStuffIds.push_back(stuff_itr->id);
    }
        
    // Deleting stuff kicks off a series of deletes that will remove
    // offers, offerstuff, and likes associated with these items

    // There should be no need to remove offers explicitely because
    // every offer associated with this account should have stuff
    // from this account associated with it

    // only call if we have ids
    if(vStuffIds.size() > 0) {
        action(
            permission_level{_self, N(active)},
            N(tradestuff), N(stuffdel),
            std::make_tuple(_self, vStuffIds) // admin mode
        ).send();
    }   

    // Get wants
    wants_index wants(_self, _self);
    auto want_account_index = wants.get_index<N(account)>();
    auto want_itr = want_account_index.lower_bound(itr->id);
    std::vector<uint64_t> vWantIds;
    for(; want_itr->account_id == itr->id && want_itr != want_account_index.end(); want_itr++) {
        vWantIds.push_back(want_itr->id);
    }

    // Inline action to delete wants
    if(vWantIds.size() > 0)
    {
        action(
            permission_level{_self, N(active)},
            N(tradestuff), N(wantdel),
            std::make_tuple(_self, vWantIds) // admin mode
        ).send();
    }    

    // Users can't like their own stuff, so we shouldn't see problems
    // deleting likes here
    likes_index likes(_self, _self);
    auto like_account_index = likes.get_index<N(account)>();
    auto like_itr = like_account_index.lower_bound(itr->id);
    std::vector<uint64_t> vLikeIds;
    for(; like_itr->account_id == itr->id && like_itr != like_account_index.end(); like_itr++) {
        vLikeIds.push_back(like_itr->id);
    }

    // Inline action to delete likes
    if(vLikeIds.size() > 0) {
        action(
            permission_level{_self, N(active)},
            N(tradestuff), N(likedel),
            std::make_tuple(_self, vLikeIds) // admin mode
        ).send();
    }
            
    accounts.erase( itr );
}

void tradestuff::stuffadd(const account_name username,
                          uint64_t category_id,
                          uint64_t condition_id,
                          const std::string& description,
                          const std::string& media,
                          float minimum_trade_value,
                          const std::string& name,
                          float value) {
    require_auth(username); // make sure authorized by account

    // address_index is typedef of our multi_index over table address
    // address table is auto "created" if needed
    account_index account(_self, _self); // code, scope

    // verify does not already exist
    // multi_index find on primary index which in our case is account
    auto user_index = account.get_index<N(username)>();
    auto itr = user_index.find(username);
    eosio_assert(itr != user_index.end(), "No account found for this username.");

    // verify category exists
    category_index categories(_self, _self);
    auto cat_itr = categories.find(category_id);
    eosio_assert(cat_itr != categories.end(), "Category does not exist.");

    // verify condition
    condition_index condition(_self, _self);
    auto cond_itr = condition.find(condition_id);
    eosio_assert(cond_itr != condition.end(), "Condition is not valid.");

    stuff_index stuff(_self, _self); // code, scope

    // add to table, first argument is account to bill for storage
    // each entry will be pilled to the associated account
    // we could have instead chosen to bill _self for all the storage
    uint64_t id = stuff.available_primary_key();
    stuff.emplace(_self , [&](auto& tss) {
	    tss.id = id;
        tss.account_id = itr->id;
        tss.category_id = category_id;
        tss.condition_id = condition_id;
        tss.description = description;
        tss.media = media;
        tss.min_trade_value = minimum_trade_value;
        tss.name = name;
        tss.status = status::active;
	    tss.value = value;
        tss.created_at = eosio::time_point_sec(now());
    });

    // Report ID Generation
    action(
        permission_level{_self, N(active)},
        N(tradestuff), N(generateid),
        std::make_tuple(std::string("stuff"), id)
    ).send();
}

void tradestuff::stuffupdate(account_name username,
                     const std::vector<uint64_t>& vStuffIds,
                     const updateStuff& updates) {

    // require either tradestuff or user authorization
    if(has_auth(_self) || has_auth(username)) {

        std::vector<uint64_t> vOfferIds;
        for(auto itr = vStuffIds.begin(); itr != vStuffIds.end(); itr++) {
            stuff_index stuff(_self, _self);
            auto stuff_itr = stuff.find(*itr);
            eosio_assert(stuff_itr != stuff.end(), "Failed to find stuff id.");

            if(has_auth(username) && username != _self) {
                account_index account(_self, _self);
                auto user_index = account.get_index<N(username)>();
                auto user_itr = user_index.find(username);
                eosio_assert(user_itr != user_index.end(), "Failed to find account for this username.");
                eosio_assert(user_itr->id == stuff_itr->account_id, "Stuff does not belong to this user.");
            }

            // If we're running under admin authority, we can make changes despite the current status
            if(has_auth(username) && username != _self) {
                eosio_assert(stuff_itr->status != status::inTrade, "This item cannot be updated: Currently in a Trade.");
            }
            
            // Delete any offers that have not been accepted that contain this item
            offerstuff_index offerstuff(_self, _self);
            auto bystuff_index = offerstuff.get_index<N(stuff)>();
            auto offerstuff_itr = bystuff_index.lower_bound(stuff_itr->id);
            offer_index offer(_self, _self);
            for(; offerstuff_itr->stuff_id == stuff_itr->id && offerstuff_itr != bystuff_index.end(); offerstuff_itr++) {
                auto offer_itr = offer.find(offerstuff_itr->offer_id);
                if(offer_itr != offer.end()) {
                    if(offer_itr->recipient_response != response::accepted) {
                        if(std::find(vOfferIds.begin(), vOfferIds.end(), offerstuff_itr->offer_id) == vOfferIds.end()) {
                            vOfferIds.push_back(offerstuff_itr->offer_id);
                        }
                    }
                }
            }

            // verify update parameters
            if(updates.category_id != NO_CHANGE) {
                category_index category(_self, _self);
                auto itr = category.find(updates.category_id);
                eosio_assert(itr != category.end(), "Cannot update stuff to non-existent category.");
            }

            if(updates.condition_id != NO_CHANGE) {
                condition_index condition(_self, _self);
                auto itr = condition.find(updates.condition_id);
                eosio_assert(itr != condition.end(), "Cannot update stuff to non-existent condition.");
            }

            if(updates.status != status::dontupdate) {
                eosio_assert(has_auth(_self), "Stuff status updates can only be performed by admin.");
                if(updates.status < status::dontupdate || updates.status >= status::NUM_STATUS) {
                    eosio_assert(false, "Cannot update stuff due to invalid status code.");
                }
            }

            stuff.modify( stuff_itr, _self /*payer*/, [&]( auto& s) {
                // only update fields if supplied
                if(updates.category_id != NO_CHANGE) { s.category_id = updates.category_id; }
                if(updates.condition_id != NO_CHANGE) { s.condition_id = updates.condition_id; }
                if(updates.description != "") { s.description = updates.description; }
                if(updates.media != "") { s.media = updates.media; }
                if(updates.min_trade_value > 0) { s.min_trade_value = updates.min_trade_value; }
                if(updates.name != "") { s.name = updates.name; }
                if(updates.status != status::dontupdate) {s.status = updates.status; }
                if(updates.value > 0) { s.value = updates.value; }
                s.updated_at = eosio::time_point_sec(now());
                if(updates.status == status::inactive) { s.inactive_at = eosio::time_point_sec(now()); }
            });
        }

        // Inline action for deleting offers
        if(vOfferIds.size() > 0) {
            action(
                permission_level{_self, N(active)},
                N(tradestuff), N(offerdel),
                std::make_tuple(username, vOfferIds)
            ).send();
        }
    }
    else {
        eosio_assert(false, "Insufficient authority.");
    } 
}

void tradestuff::offeradd(const account_name username,
                  const uint64_t creator_id,
                  const std::vector<uint64_t>& vCreatorStuffIds,
                  const uint64_t recipient_id,
                  const std::vector<uint64_t>& vRecipientStuffIds,
                  const eosio::time_point_sec& expires_at) {
    require_auth(username);

    // Can't trade with yourself
    eosio_assert(creator_id != recipient_id, "User cannot create a trade with themselves.");

    // Can't be a past datetime
    eosio::time_point_sec right_now(now());
    eosio_assert(expires_at > right_now, "Expiration must be later than current datetime.");

    // Creator must be user
    account_index account(_self, _self);
    auto user_index = account.get_index<N(username)>();
    auto user_itr = user_index.find(username);
    eosio_assert(user_itr != user_index.end(), "User does not exist.");
    eosio_assert(user_itr->id == creator_id, "This user cannot create an offer for another account.");
    
    // verify all creator stuff belongs to creator
    stuff_index stuff(_self, _self);
    for(auto creatorstuff_itr = vCreatorStuffIds.begin(); creatorstuff_itr != vCreatorStuffIds.end(); creatorstuff_itr++) {
        auto stuff_itr = stuff.find(*creatorstuff_itr);
        eosio_assert(stuff_itr != stuff.end(), "Creator stuff does not exist.");
        eosio_assert(stuff_itr->account_id == user_itr->id, "This item does not belong to the creator.");
        eosio_assert(stuff_itr->status == status::active, "The creator's stuff is not currently active.");
    }

    // verify all recipient stuff belongs to recipient
    auto recipient_itr = account.find(recipient_id);
    eosio_assert(recipient_itr != account.end(), "Recipient does not exist.");

    for(auto recipientstuff_itr = vRecipientStuffIds.begin(); recipientstuff_itr != vRecipientStuffIds.end(); recipientstuff_itr++) {
        auto stuff_itr = stuff.find(*recipientstuff_itr);
        eosio_assert(stuff_itr != stuff.end(), "Recipient stuff does not exist.");
        eosio_assert(stuff_itr->account_id == recipient_id, "This item does not belong to the recipient.");
        eosio_assert(stuff_itr->status == status::active, "Recipient's stuff is not currently active.");
    }

    // Check for creator duplicate offer
    offerstuff_index offerstuff(_self, _self);
    auto byoffer_index = offerstuff.get_index<N(offer)>();
    offer_index offer(_self, _self);
    auto creator_index = offer.get_index<N(creator)>();
    auto creator_itr = creator_index.lower_bound(user_itr->id);
    for(; creator_itr->creator_id == user_itr->id && creator_itr != creator_index.end(); creator_itr++) {
        // Check each offer to this recipient to see if the offerstuff contains the same
        // item ids
        if(creator_itr->recipient_id == recipient_id) {
            // Get the offer stuff, namely the stuff ids
            std::vector<uint64_t> vStuffIds;
            auto offerstuff_itr = byoffer_index.lower_bound(creator_itr->id);
            for(; offerstuff_itr->offer_id == creator_itr->id && offerstuff_itr != byoffer_index.end(); offerstuff_itr++) {
                vStuffIds.push_back(offerstuff_itr->stuff_id);
            }

            bool bCreatorItemsSame = true;
            bool bRecipientItemsSame = true;
            // Quick check to see if they even have the same number of items
            if(vStuffIds.size() == (vCreatorStuffIds.size() + vRecipientStuffIds.size())) {
                // interrogate to see if the items are the same
                for(int i = 0; i < vCreatorStuffIds.size(); i++) {
                    if(std::find(vStuffIds.begin(), vStuffIds.end(), vCreatorStuffIds[i]) == vStuffIds.end()) {
                        bCreatorItemsSame = false;
                        break;
                    }
                }

                // Checked the creator's stuff and they were the same
                // Now check the recipient's stuff
                if(bCreatorItemsSame) {
                    for(int i = 0; i < vRecipientStuffIds.size(); i++) {
                        if(std::find(vStuffIds.begin(), vStuffIds.end(), vRecipientStuffIds[i]) == vStuffIds.end()) {
                            bRecipientItemsSame = false;
                            break;
                        }
                    }
                }
            }
            else {
                // This offer doesn't even have the same number of items, so it can't be a dupe
                bCreatorItemsSame = false;
                bRecipientItemsSame = false;
            }

            eosio_assert(!bCreatorItemsSame || !bRecipientItemsSame, "The offer creator has already submitted this offer.");
        }
    }

    // Check for recipient duplicate offer
    auto recipientoffer_itr = creator_index.lower_bound(recipient_id);
    for(; recipientoffer_itr->creator_id == recipient_id && recipientoffer_itr != creator_index.end(); recipientoffer_itr++) {
        // Check each offer from the recipient to the creator to see if the offerstuff contains the same
        // item ids
        if(recipientoffer_itr->recipient_id == creator_id) {
            // Get the offer stuff, namely the stuff ids
            std::vector<uint64_t> vStuffIds;
            auto offerstuff_itr = byoffer_index.lower_bound(recipientoffer_itr->id);
            for(; offerstuff_itr->offer_id == recipientoffer_itr->id && offerstuff_itr != byoffer_index.end(); offerstuff_itr++) {
                vStuffIds.push_back(offerstuff_itr->stuff_id);
            }

            bool bCreatorItemsSame = true;
            bool bRecipientItemsSame = true;
            // Quick check to see if they even have the same number of items
            if(vStuffIds.size() == (vCreatorStuffIds.size() + vRecipientStuffIds.size())) {
                // interrogate to see if the items are the same
                for(int i = 0; i < vCreatorStuffIds.size(); i++) {
                    if(std::find(vStuffIds.begin(), vStuffIds.end(), vCreatorStuffIds[i]) == vStuffIds.end()) {
                        bCreatorItemsSame = false;
                        break;
                    }
                }

                // Checked the creator's stuff and they were the same
                // Now check the recipient's stuff
                if(bCreatorItemsSame) {
                    for(int i = 0; i < vRecipientStuffIds.size(); i++) {
                        if(std::find(vStuffIds.begin(), vStuffIds.end(), vRecipientStuffIds[i]) == vStuffIds.end()) {
                            bRecipientItemsSame = false;
                            break;
                        }
                    }
                }
            }
            else {
                // This offer doesn't even have the same number of items, so it can't be a dupe
                bCreatorItemsSame = false;
                bRecipientItemsSame = false;
            }

            eosio_assert(!bCreatorItemsSame || !bRecipientItemsSame, "The recipient has already submitted this offer.");
        }
    }

    // create offer
    uint64_t offer_id = offer.available_primary_key();
    offer.emplace(_self , [&](auto& off) {
        off.id = offer_id;
        off.creator_id = creator_id;
        off.recipient_id = recipient_id;
        off.recipient_response = response::noResponse;
        off.expires_at = expires_at;
        off.created_at = eosio::time_point_sec(now());
    });

    // Generate ID
    action(
        permission_level{_self, N(active)},
        N(tradestuff), N(generateid),
        std::make_tuple(std::string("offer"), offer_id)
    ).send();
 
    // creator offerstuff
    for(auto creatorstuff_itr = vCreatorStuffIds.begin(); creatorstuff_itr != vCreatorStuffIds.end(); creatorstuff_itr++) {
        // Generate ID and save it.
        uint64_t offerStuffId = offerstuff.available_primary_key();
        
        // create offerstuff
        offerstuff.emplace(_self , [&](auto& offstuff) {
            offstuff.id = offerStuffId;
            offstuff.offer_id = offer_id;
            offstuff.stuff_id = *creatorstuff_itr;
        });

        // Generate ID and details
        action(
            permission_level{_self, N(active)},
            N(tradestuff), N(offerstuffid),
            std::make_tuple(std::string("offerstuff"), offerStuffId, offer_id, *creatorstuff_itr)
        ).send();
    }

    // recipient offerstuff
    for(auto recipientstuff_itr = vRecipientStuffIds.begin(); recipientstuff_itr != vRecipientStuffIds.end(); recipientstuff_itr++) {
        // Generate ID and save it.
        uint64_t offerStuffId = offerstuff.available_primary_key();
        
        // create offerstuff
        offerstuff.emplace(_self , [&](auto& offstuff) {
            offstuff.id = offerStuffId;
            offstuff.offer_id = offer_id;
            offstuff.stuff_id = *recipientstuff_itr;
        });

        // Generate ID
        action(
            permission_level{_self, N(active)},
            N(tradestuff), N(offerstuffid),
            std::make_tuple(std::string("offerstuff"), offerStuffId, offer_id, *recipientstuff_itr)
        ).send();
    }
}

void tradestuff::offeraccpt(const account_name username,
                            const uint64_t offer_id) {
    require_auth(username);
    // get user account
    account_index account(_self, _self);
    auto user_index = account.get_index<N(username)>();
    auto user_itr = user_index.find(username);
    eosio_assert(user_itr != user_index.end(), "Failed to find this user.");

    // validate offer
    offer_index offer(_self, _self);
    auto offer_itr = offer.find(offer_id);
    eosio_assert(offer_itr != offer.end(), "Failed to find this offer id.");

    // validate recipient
    eosio_assert(offer_itr->recipient_id == user_itr->id, "User is not the recipient of this offer.");

    // has this offer already been responded to
    eosio_assert(offer_itr->recipient_response == response::noResponse, "This offer has already been responded to.");

    // Check expiration
    eosio_assert(offer_itr->expires_at >= eosio::time_point_sec(now()), "This offer is currently expired.");

    // verify all items in offer are active
    offerstuff_index offerstuff(_self, _self);
    auto byoffer_index = offerstuff.get_index<N(offer)>();
    auto offerstuff_itr = byoffer_index.lower_bound(offer_id);

    likes_index likes(_self, _self);
    
    std::vector<uint64_t> vStuffIds;
    std::vector<uint64_t> vLikeIds;
    std::vector<uint64_t> vOfferIds;
    stuff_index stuff(_self, _self);
    for(; offerstuff_itr->offer_id == offer_id && offerstuff_itr != byoffer_index.end(); offerstuff_itr++) {
        // for each item in this offer, verify active status
        auto stuff_itr = stuff.find(offerstuff_itr->stuff_id);
        eosio_assert(stuff_itr != stuff.end(), "Failed to find stuff in this offer.");
        eosio_assert(stuff_itr->status == status::active, "Stuff in this offer is not currently active.");
        // save this id for later
        vStuffIds.push_back(stuff_itr->id);

        // for each item in this offer, delete all the likes
        auto likestuff_index = likes.get_index<N(stuff)>();
        auto like_itr = likestuff_index.lower_bound(stuff_itr->id);
        
        for(; like_itr->stuff_id == stuff_itr->id && like_itr != likestuff_index.end(); like_itr++) {
            vLikeIds.push_back(like_itr->id);
        }
        
        // for each item delete any other offers
        auto bystuff_index = offerstuff.get_index<N(stuff)>();
        auto bystuff_itr = bystuff_index.lower_bound(stuff_itr->id);

        // iterate all offerstuff, and get the offer ids that aren't this current offer
        for(; bystuff_itr->stuff_id == stuff_itr->id && bystuff_itr != bystuff_index.end(); bystuff_itr++) {
            // exclude this offer, but only if we haven't added it already
            if(bystuff_itr->offer_id != offer_id) {
                if(std::find(vOfferIds.begin(), vOfferIds.end(), bystuff_itr->offer_id) == vOfferIds.end()) {
                    vOfferIds.push_back(bystuff_itr->offer_id);
                }
            }
        }
    }

    // Fire inline action to delete likes
    if(vLikeIds.size() > 0) {
        action(
            permission_level{_self, N(active)},
            N(tradestuff), N(likedel),
                std::make_tuple(_self, vLikeIds)
        ).send();
    }

    // Delete these offers
    if(vOfferIds.size() > 0) {
        action(
            permission_level{_self, N(active)},
            N(tradestuff), N(offerdel),
            std::make_tuple(_self, vOfferIds)
        ).send();
    }
    
    // Stuff object that will only update status
    struct updateStuff updates;
    updates.category_id = NO_CHANGE;
    updates.condition_id = NO_CHANGE;
    updates.description = "";
    updates.media = "";
    updates.min_trade_value = -1;
    updates.name = "";
    updates.value = -1;
    updates.status = status::inTrade;

    // Fire inline action to update stuff
    if(vStuffIds.size() > 0) {
        action(
            permission_level{_self, N(active)},
            N(tradestuff), N(stuffupdate),
            std::make_tuple(_self, vStuffIds, updates)
        ).send();
    }
    
    // Update the status of this offer
    // update offer response
    offer.modify( offer_itr, _self /*payer*/, [&]( auto& off) {
        off.recipient_response = response::accepted;
        off.updated_at = eosio::time_point_sec(now());
    });
    
    // Create the trade now
    trade_index trade(_self, _self);
    uint64_t trade_id = trade.available_primary_key();
    trade.emplace(_self /*payer of RAM*/, [&](auto& tr){
        tr.id = trade_id;
        tr.offer_id = offer_id;
        tr.creator_stuff_sent = false;
        tr.recipient_stuff_sent = false;
        tr.creator_stuff_received = false;
        tr.recipient_stuff_received = false;
        tr.created_at = eosio::time_point_sec(now());
    });

    // Report new trade id
    action(
        permission_level{_self, N(active)},
        N(tradestuff), N(generateid),
        std::make_tuple(std::string("trade"), trade_id)
    ).send();
}

void tradestuff::offerdecl(const account_name username,
               const uint64_t offer_id) {
    require_auth(username);

    // verify offer id
    offer_index offer(_self, _self);
    auto offer_itr = offer.find(offer_id);
    eosio_assert(offer_itr != offer.end(), "Failed to find this offer id.");

    // verify user is offer recipient
    account_index account(_self, _self);
    auto user_index = account.get_index<N(username)>();
    auto user_itr = user_index.find(username);
    eosio_assert(user_itr != user_index.end(), "Could not find user account.");
    eosio_assert(offer_itr->recipient_id == user_itr->id, "This user is not the recipient of this offer.");

    // verify that offer hasn't already been responded to
    eosio_assert(offer_itr->recipient_response == response::noResponse, "User has already responsed to this offer.");

    // update offer response
    offer.modify( offer_itr, _self /*payer*/, [&]( auto& off) {
        off.recipient_response = response::declined;
        off.updated_at = eosio::time_point_sec(now());
    });

    // Fire separate action to delete this offer
    std::vector<uint64_t> vOfferIds;
    vOfferIds.push_back(offer_itr->id);
    action(
        permission_level{_self, N(active)},
        N(tradestuff), N(offerdel),
        std::make_tuple(username, vOfferIds)
    ).send();
}

void tradestuff::offerrenew(const account_name username,
                            const uint64_t offer_id,
                            const eosio::time_point_sec& expires_at) {
    // require either tradestuff or user authorization
    if(has_auth(_self) || has_auth(username)) {

        // verify valid expiration
        eosio::time_point_sec right_now(now());
        eosio_assert(expires_at > right_now, "Expiration must be later than current datetime.");

        // verify offer id
        offer_index offer(_self, _self);
        auto offer_itr = offer.find(offer_id);
        eosio_assert(offer_itr != offer.end(), "Failed to find this offer id.");

        if(has_auth(username) && username != _self) {
            // verify user is offer creator
            account_index account(_self, _self);
            auto user_index = account.get_index<N(username)>();
            auto user_itr = user_index.find(username);
            eosio_assert(user_itr != user_index.end(), "Could not find user account.");
            eosio_assert(offer_itr->creator_id == user_itr->id, "This user is not the creator of this offer.");
        }

        // verify that offer hasn't already been responded to
        eosio_assert(offer_itr->recipient_response == response::noResponse, "User has already responsed to this offer.");

        // update offer expiration
        offer.modify( offer_itr, _self /*payer*/, [&]( auto& off) {
            off.expires_at = expires_at;
            off.updated_at = eosio::time_point_sec(now());
        });
    }
    else {
        eosio_assert(false, "Insufficient authority.");
    } 
}

void tradestuff::stuffsent(const account_name username,
                           const uint64_t trade_id) {
    require_auth(username);

    // verify user is part of this trade
    trade_index trade(_self, _self);
    auto trade_itr = trade.find(trade_id);
    eosio_assert(trade_itr != trade.end(), "Failed to find trade with this Id.");
    offer_index offer(_self, _self);
    auto offer_itr = offer.find(trade_itr->offer_id);
    eosio_assert(offer_itr != offer.end(), "Failed to find the offer associated with this trade.");

    account_index account(_self, _self);
    auto user_index = account.get_index<N(username)>();
    auto user_itr = user_index.find(username);
    eosio_assert(user_itr != user_index.end(), "Account not found for this user.");
    eosio_assert(user_itr->id == offer_itr->creator_id || user_itr->id == offer_itr->recipient_id, "This user is not the creator or recipient of this offer.");

    // update trade sent status
    trade.modify( trade_itr, _self /*payer*/, [&]( auto& tr) {
        (user_itr->id == offer_itr->creator_id) ? tr.creator_stuff_sent = true : tr.recipient_stuff_sent = true;
        tr.updated_at = eosio::time_point_sec(now());
    });
}

void tradestuff::stuffrecv(const account_name username,
                           const uint64_t trade_id) {
    require_auth(username);

    // verify user is part of this trade
    trade_index trade(_self, _self);
    auto trade_itr = trade.find(trade_id);
    eosio_assert(trade_itr != trade.end(), "Failed to find trade with this Id.");
    offer_index offer(_self, _self);
    auto offer_itr = offer.find(trade_itr->offer_id);
    eosio_assert(offer_itr != offer.end(), "Failed to find the offer associated with this trade.");

    account_index account(_self, _self);
    auto user_index = account.get_index<N(username)>();
    auto user_itr = user_index.find(username);
    eosio_assert(user_itr != user_index.end(), "Account not found for this user.");
    eosio_assert(user_itr->id == offer_itr->creator_id || user_itr->id == offer_itr->recipient_id, "This user is not the creator or recipient of this offer.");

    // Does this complete the trade? If so, set completed time and deactivate items
    bool bTradeComplete = false;

    // update trade sent status
    trade.modify( trade_itr, _self /*payer*/, [&]( auto& tr) {
        (user_itr->id == offer_itr->creator_id) ? tr.creator_stuff_received = true : tr.recipient_stuff_received = true;
        if(tr.creator_stuff_sent &&
           tr.recipient_stuff_sent &&
           tr.creator_stuff_received &&
           tr.recipient_stuff_received) {
            bTradeComplete = true;
            tr.completed_at = eosio::time_point_sec(now());
        }
        tr.updated_at = eosio::time_point_sec(now());
    });

    if(bTradeComplete) {
        // deactivate the items associated with this trade
        std::vector<uint64_t> vStuffIds;
        offerstuff_index offerstuff(_self, _self);
        auto byoffer_index = offerstuff.get_index<N(offer)>();
        auto offerstuff_itr = byoffer_index.lower_bound(offer_itr->id);

        for(; offerstuff_itr->offer_id == offer_itr->id && offerstuff_itr != byoffer_index.end(); offerstuff_itr++) {
            vStuffIds.push_back(offerstuff_itr->stuff_id);
        }

        // Stuff object that will only update status
        struct updateStuff updates;
        updates.category_id = NO_CHANGE;
        updates.condition_id = NO_CHANGE;
        updates.description = "";
        updates.media = "";
        updates.min_trade_value = -1;
        updates.name = "";
        updates.value = -1;
        updates.status = status::inactive;

        if(vStuffIds.size() > 0) {
            action(
                permission_level{_self, N(active)},
                N(tradestuff), N(stuffupdate),
                std::make_tuple(_self, vStuffIds, updates)
            ).send();
        }
    }
}

void tradestuff::catadd(const string& name) {
    require_auth(_self);

    category_index categories(_self, _self);
    
    // hash this name so we can query
    checksum256 name_sha;
    sha256(const_cast<char*>(name.c_str()), name.size(), &name_sha);
    
    auto sha_index = categories.get_index<N(name)>();
    auto itr = sha_index.find(category::to_key(name_sha));

    eosio_assert(itr == sha_index.end(), "Category name already exists.");

    uint64_t id = categories.available_primary_key();
    categories.emplace(_self /*payer of RAM*/, [&](auto& cat){
        cat.id = id;
        cat.name = name;
        cat.created_at = eosio::time_point_sec(now());
    });

    // Fire inline action to report ID generation.
    action(
        permission_level{_self, N(active)},
        N(tradestuff), N(generateid),
        std::make_tuple(std::string("category"), id)
    ).send();
}

void tradestuff::catupdate(const uint64_t category_id, const string& name) {
    require_auth(_self);

    category_index categories(_self, _self);
    auto cat_itr = categories.find(category_id);

    // hash this name so we can query
    checksum256 name_sha;
    sha256(const_cast<char*>(name.c_str()), name.size(), &name_sha);

    auto sha_index = categories.get_index<N(name)>();
    auto itr = sha_index.find(category::to_key(name_sha));

    eosio_assert(itr == sha_index.end(), "Category name already exists.");
    eosio_assert(cat_itr != categories.end(), "Category ID does not exist.");

    categories.modify(cat_itr, _self /*payer of RAM*/, [&](auto& cat){
        cat.name = name;
        cat.updated_at = eosio::time_point_sec(now());
    });
}

void tradestuff::catdel(const uint64_t category_id, const uint64_t replacement_id) {
    require_auth(_self);

    category_index categories(_self, _self);
    auto cat_itr = categories.find(category_id);
    auto replacement_itr = categories.find(replacement_id);
    
    eosio_assert(cat_itr != categories.end(), "Category ID does not exist for deletion.");
    eosio_assert(replacement_itr != categories.end(), "Category ID does not exist for replacement.");

    // Get all wants for this category
    wants_index wants(_self, _self);
    auto category_index = wants.get_index<N(category)>();
    auto wants_itr = category_index.lower_bound(category_id);
    std::vector<uint64_t> vWantIds;
    for(; wants_itr->category_id == category_id && wants_itr != category_index.end(); wants_itr++) {
        vWantIds.push_back(wants_itr->id);
    }

    // Fire inline action to delete wants
    if(vWantIds.size() > 0 ) {
        action(
            permission_level{_self, N(active)},
            N(tradestuff), N(wantdel),
            std::make_tuple(_self, vWantIds)
        ).send();
    }
    
    // Get all stuff for this category and update to replacement
    stuff_index stuff(_self, _self);
    auto bycat_index = stuff.get_index<N(category)>();
    auto bycat_itr = bycat_index.lower_bound(category_id);
    std::vector<uint64_t> vStuffIds;
    for(; bycat_itr->category_id == category_id && bycat_itr != bycat_index.end(); bycat_itr++) {
        vStuffIds.push_back(bycat_itr->id);
    }

    // Stuff object that will only update category
    struct updateStuff updates;
    updates.category_id = replacement_id;
    updates.condition_id = NO_CHANGE;
    updates.description = "";
    updates.media = "";
    updates.min_trade_value = -1;
    updates.name = "";
    updates.value = -1;
    updates.status = status::dontupdate;

    // Fire inline action to update stuff
    if(vStuffIds.size() > 0) {
        action(
            permission_level{_self, N(active)},
            N(tradestuff), N(stuffupdate),
            std::make_tuple(_self, vStuffIds, updates)
        ).send();
    }
    
    categories.erase(cat_itr);
}

void tradestuff::condadd(const string& name) {
    require_auth(_self);

    condition_index condition(_self, _self);
    
    // hash this name so we can query
    checksum256 name_sha;
    sha256(const_cast<char*>(name.c_str()), name.size(), &name_sha);
    
    auto sha_index = condition.get_index<N(name)>();
    auto itr = sha_index.find(condition::to_key(name_sha));

    eosio_assert(itr == sha_index.end(), "Condition name already exists.");

    uint64_t id = condition.available_primary_key();
    condition.emplace(_self /*payer of RAM*/, [&](auto& cond){
        cond.id = id;
        cond.name = name;
        cond.created_at = eosio::time_point_sec(now());
    });

    // Fire inline action to report ID generation.
    action(
        permission_level{_self, N(active)},
        N(tradestuff), N(generateid),
        std::make_tuple(std::string("condition"), id)
    ).send();
}

void tradestuff::condupdate(const uint64_t condition_id, const string& name) {
    require_auth(_self);

    condition_index condition(_self, _self);
    auto cond_itr = condition.find(condition_id);

    // hash this name so we can query
    checksum256 name_sha;
    sha256(const_cast<char*>(name.c_str()), name.size(), &name_sha);
    
    auto sha_index = condition.get_index<N(name)>();
    auto itr = sha_index.find(condition::to_key(name_sha));
    
    eosio_assert(itr == sha_index.end(), "Condition name already exists.");
    eosio_assert(cond_itr != condition.end(), "Condition ID does not exist.");

    condition.modify(cond_itr, _self /*payer of RAM*/, [&](auto& cond){
        cond.name = name;
        cond.updated_at = eosio::time_point_sec(now());
    });
}

void tradestuff::conddel(const uint64_t condition_id, const uint64_t replacement_id) {
    require_auth(_self);

    condition_index condition(_self, _self);
    auto cond_itr = condition.find(condition_id);
    auto replacement_itr = condition.find(replacement_id);
    
    eosio_assert(cond_itr != condition.end(), "Condition ID does not exist for deletion.");
    eosio_assert(replacement_itr != condition.end(), "Condition ID does not exist for replacement.");

    // Get all stuff for this condition and update to replacement
    stuff_index stuff(_self, _self);
    auto bycond_index = stuff.get_index<N(condition)>();
    auto bycond_itr = bycond_index.lower_bound(condition_id);
    std::vector<uint64_t> vStuffIds;
    for(; bycond_itr->condition_id == condition_id && bycond_itr != bycond_index.end(); bycond_itr++) {
        vStuffIds.push_back(bycond_itr->id);
    }

    // Stuff object that will only update condition
    struct updateStuff updates;
    updates.category_id = NO_CHANGE;
    updates.condition_id = replacement_id;
    updates.description = "";
    updates.media = "";
    updates.min_trade_value = -1;
    updates.name = "";
    updates.value = -1;
    updates.status = status::dontupdate;

    // Fire inline action to update stuff
    if(vStuffIds.size() > 0) {
        action(
            permission_level{_self, N(active)},
            N(tradestuff), N(stuffupdate),
            std::make_tuple(_self, vStuffIds, updates)
        ).send();
    }
    
    condition.erase(cond_itr);
}

void tradestuff::wantadd(const account_name username, uint64_t category_id) {
    // require either tradestuff or user authorization
    if(has_auth(_self) || has_auth(username)) {
        // verify user
        account_index account(_self, _self);
        auto user_index = account.get_index<N(username)>();
        auto user_itr = user_index.find(username);
        eosio_assert(user_itr != user_index.end(), "Failed to find this user.");

        // verify that this category exists
        category_index categories(_self, _self);
        auto cat_itr = categories.find(category_id);
        eosio_assert(cat_itr != categories.end(), "Failed to find this category.");

        // no duplicates
        wants_index wants(_self, _self);
        auto byaccount_index = wants.get_index<N(account)>();
        auto byaccount_itr = byaccount_index.lower_bound(user_itr->id);
        for(; byaccount_itr->account_id == user_itr->id && byaccount_itr != byaccount_index.end(); byaccount_itr++) {
            eosio_assert(byaccount_itr->category_id != category_id, "This user already wants this category.");
        }
        
        // we made it this far, let's make it official
        uint64_t id = wants.available_primary_key();
        wants.emplace(_self, [&](auto& w) {
            w.id = id;
            w.account_id = user_itr->id;
            w.category_id = category_id;
        });

        // Fire event for new want ID
        action(
            permission_level{_self, N(active)},
            N(tradestuff), N(generateid),
            std::make_tuple(std::string("want"), id)
        ).send();
    }
    else {
        eosio_assert(false, "Insufficient authority.");
    }   
}

void tradestuff::likeadd(const account_name username, uint64_t stuff_id) {
    require_auth(username); // make sure authorized by account

    stuff_index stuff(_self, _self);
    auto stuff_itr = stuff.find(stuff_id);
    eosio_assert(stuff_itr != stuff.end(), "Stuff does not exist");

    account_index account(_self, _self);
    auto user_index = account.get_index<N(username)>();
    auto user_itr = user_index.find(username);
    eosio_assert(user_itr != user_index.end(), "Username not found.");
    eosio_assert(stuff_itr->account_id != user_itr->id, "Cannot like your own item.");

    likes_index likes(_self, _self);
    auto byuser_index = likes.get_index<N(account)>();
    auto account_itr = byuser_index.lower_bound(user_itr->id);
    for(; account_itr->account_id == user_itr->id && account_itr != byuser_index.end(); account_itr++) {
        eosio_assert(account_itr->stuff_id != stuff_id, "This item has already been liked by this user.");
    }
    
    uint64_t id = likes.available_primary_key();
    likes.emplace(_self, [&](auto& sl) {
	    sl.id = id;
        sl.account_id = user_itr->id; 
        sl.stuff_id = stuff_id;
    });

    action(
        permission_level{_self, N(active)},
        N(tradestuff), N(generateid),
        std::make_tuple(std::string("like"), id)
    ).send();
}

void tradestuff::offerdel(const account_name username, const std::vector<uint64_t>& vOfferIds) {
    // require either tradestuff or user authorization
    if(has_auth(_self) || has_auth(username)) {
        offer_index offer(_self, _self);

        account_index account(_self, _self);
        auto user_index = account.get_index<N(username)>();
        auto user_itr = user_index.end();
        if(has_auth(username) && username != _self) {
            // Get the user account if needed
            user_itr = user_index.find(username);
            eosio_assert(user_itr != user_index.end(), "Could not find account for this username.");
        }


        for(auto itr = vOfferIds.begin(); itr != vOfferIds.end(); itr++) {
            auto offer_itr = offer.find(*itr);
            eosio_assert(offer_itr != offer.end(), "Failed to find offer for deletion.");
            // if this isn't the 'admin' account, we can only delete the offers
            // created by this user
            if(has_auth(username) && username != _self) {
                eosio_assert(offer_itr->creator_id == user_itr->id, "User is not the creator of this offer.");
            }

            eosio_assert(offer_itr->recipient_response != response::accepted, "Recipient has accepted this offer, unable to delete.");

            // Get all offerstuff associated with this offer
            offerstuff_index offerstuff(_self, _self);
            auto stuffbyoffer_index = offerstuff.get_index<N(offer)>();
            auto byoffer_itr = stuffbyoffer_index.lower_bound(offer_itr->id);
            std::vector<uint64_t> vOfferStuffIds;
            for(; byoffer_itr->offer_id == offer_itr->id && byoffer_itr != stuffbyoffer_index.end(); byoffer_itr++) {
                vOfferStuffIds.push_back(byoffer_itr->id);
            }

            // Issue inline action to delete offerstuff
            if(vOfferStuffIds.size() > 0) {
                action(
                    permission_level{_self, N(active)},
                    N(tradestuff), N(offerstufdel),
                    std::make_tuple(username, vOfferStuffIds)
                ).send();
            }
            
            offer.erase(offer_itr);
        }
    }
    else {
        eosio_assert(false, "Insufficient authority.");
    }

}

void tradestuff::offerstufdel(const account_name username, const std::vector<uint64_t>& vOfferStuffIds) {
    // require tradestuff
    require_auth(_self);

    offerstuff_index offerstuff(_self, _self);

    for(auto itr = vOfferStuffIds.begin(); itr != vOfferStuffIds.end(); itr++) {
        auto offerstuff_itr = offerstuff.find(*itr);
        eosio_assert(offerstuff_itr != offerstuff.end(), "Failed to find offerstuff for deletion.");
            
        offerstuff.erase(offerstuff_itr);
    }
}

void tradestuff::stuffdel(account_name username, const std::vector<uint64_t>& vStuffIds) {
    // require either tradestuff or user authorization
    if(has_auth(_self) || has_auth(username)) {
        stuff_index stuff(_self, _self);

        // get the user account for this action
        account_index account(_self, _self);
        auto username_index = account.get_index<N(username)>();
        auto account_itr = username_index.find(username);

        // If we call this with 'admin' account, we don't care whose stuff this is
        // we're going to delete it no matter what
        if(username != _self) {
            eosio_assert(account_itr != username_index.end(), "This username does not have an account.");
        }
        
        for(auto itr = vStuffIds.begin(); itr != vStuffIds.end(); itr++) {
            auto stuff_itr = stuff.find(*itr);
            eosio_assert(stuff_itr != stuff.end(), "Failed to find stuff for deletion.");
            if(has_auth(username) && username != _self) {
                // if this isn't the admin account, check that the user owns this
                eosio_assert(account_itr->id == stuff_itr->account_id, "This stuff does not belong to this user account.");
            }

            // this item cannot be in an active trade
            eosio_assert(stuff_itr->status != status::inTrade, "This stuff is currently in an active trade.");

            // Get all likes
            likes_index likes(_self, _self);
            auto likesbystuff_index = likes.get_index<N(stuff)>();
            auto likesbystuff_itr = likesbystuff_index.lower_bound((*itr));
            std::vector<uint64_t> vLikeIds;
            for(; likesbystuff_itr->stuff_id == (*itr) && likesbystuff_itr != likesbystuff_index.end(); likesbystuff_itr++) {
                vLikeIds.push_back(likesbystuff_itr->id);
            }

            // Delete all likes for this item
            if(vLikeIds.size() > 0) {
                action(
                    permission_level{_self, N(active)},
                    N(tradestuff), N(likedel),
                    std::make_tuple(username, vLikeIds)
                ).send();
            }
            
            // Delete all offers containing this item
            offerstuff_index offerstuff(_self, _self);
            auto bystuff_index = offerstuff.get_index<N(stuff)>();
            auto bystuff_itr = bystuff_index.lower_bound((*itr));
            std::vector<uint64_t> vOfferIds;
            for(; bystuff_itr->stuff_id == (*itr) && bystuff_itr != bystuff_index.end(); bystuff_itr++) {
                // No item should be in the same offer twice
                vOfferIds.push_back(bystuff_itr->offer_id);
            }

            // delete offers
            if(vOfferIds.size() > 0) {
                action(
                    permission_level{_self, N(active)},
                    N(tradestuff), N(offerdel),
                    std::make_tuple(username, vOfferIds)
                ).send();
            }

            stuff.erase(stuff_itr);
        }
    }
    else {
        eosio_assert(false, "Insufficient authority.");
    }
}

void tradestuff::likedel(account_name username, const std::vector<uint64_t>& vLikeIds) {
    // require either tradestuff or user authorization
    if(has_auth(_self) || has_auth(username)) {
        likes_index likes(_self, _self);

        account_index account(_self, _self);
        auto user_index = account.get_index<N(username)>();
        auto user_itr = user_index.find(username);

        for(auto itr = vLikeIds.begin(); itr != vLikeIds.end(); itr++) {
            auto like_itr = likes.find((*itr));
            eosio_assert(like_itr != likes.end(), "Like ID not found.");

            // Verify the account and the stuff id if not admin account
            if(has_auth(username) && username != _self) {
                eosio_assert(user_itr != user_index.end(), "No account found for this user.");
                eosio_assert(like_itr->account_id == user_itr->id, "Like does not belong to this user.");
            }

            stuff_index stuff(_self, _self);
            auto stuff_itr = stuff.find(like_itr->stuff_id);
            eosio_assert(stuff_itr != stuff.end(), "Stuff does not exist.");

            likes.erase(like_itr);
        }
    }
    else {
        eosio_assert(false, "Insufficient authority.");
    } 
}

void tradestuff::wantdel(account_name username, const std::vector<uint64_t>& vWantIds) {
    // require either tradestuff or user authorization
    if(has_auth(_self) || has_auth(username)) {
        // verify account
        account_index account(_self, _self);
        auto byusername_index = account.get_index<N(username)>();
        auto username_itr = byusername_index.find(username);

        // If called with 'admin' account, we don't care to validate,
        // we're deleting no matter what
        if(username != _self) {
            eosio_assert(username_itr != byusername_index.end(), "User account not found.");
        }
        
        wants_index wants(_self, _self);
        for(auto itr = vWantIds.begin(); itr != vWantIds.end(); itr++) {
            auto want_itr = wants.find((*itr));
            eosio_assert(want_itr != wants.end(), "Want not found.");

            // verify category
            category_index category(_self, _self);
            auto cat_itr = category.find(want_itr->category_id);
            eosio_assert(cat_itr != category.end(), "Category does not exist.");
            
            // delete
            wants.erase(want_itr);
        }
    }
    else {
        eosio_assert(false, "Insufficient authority.");
    } 
}

void tradestuff::generateid(const std::string& type, const uint64_t id) {
    require_auth(_self);
}

void tradestuff::offerstuffid(const std::string& type, const uint64_t id, const uint64_t offer_id, const uint64_t stuff_id) {
    require_auth(_self);
}

void tradestuff::delexpired() {
    require_auth(_self);

    std::vector<uint64_t> vOfferIds;

    // Remove all expired offers
    eosio::time_point_sec right_now(now());

    offer_index offer(_self, _self);
    auto expire_index = offer.get_index<N(epoch_sec)>();
    auto expire_itr = expire_index.upper_bound(right_now.sec_since_epoch());
    for(auto itr = expire_index.begin(); itr->expires_at <= right_now && (itr != expire_itr || itr != expire_index.end()); itr++) {
        vOfferIds.push_back(itr->id);
    }

    if(vOfferIds.size() > 0) {
        // Create action for removal
        action(
            permission_level{_self, N(active)},
            N(tradestuff), N(offerdel),
            std::make_tuple(_self, vOfferIds)
        ).send();
    }
}

void tradestuff::delinactive(uint32_t days) {
    require_auth(_self);

    eosio::time_point_sec days_ago(now() - days*HOURS_IN_DAY*MINUTES_IN_HOUR*SECONDS_IN_MIN);

    // Remove inactive items
    std::vector<uint64_t> vStuffIds;
    stuff_index stuff(_self, _self);
    auto status_index = stuff.get_index<N(status)>();
    auto itr = status_index.lower_bound(status::inactive);
    for(; itr->status == status::inactive && itr != status_index.end(); itr++) {
        if(itr->inactive_at < days_ago) {
            vStuffIds.push_back(itr->id);
        }
    }

    if(vStuffIds.size() > 0) {
        // Create action for removal
        action(
            permission_level{_self, N(active)},
            N(tradestuff), N(stuffdel),
            std::make_tuple(_self, vStuffIds)
        ).send();
    }
}

void tradestuff::transfer(uint64_t sender,uint64_t receiver ) {
    auto data = eosio::unpack_action_data<transfer_data>();
    if(receiver == _self) {
        if(has_auth(data.from)) {
            eosio_assert(data.to == _self, "This transfer was not intended for this account.");
            // Verify simple memo
            if(data.memo == "tradestuff::deposit") {
                deposit(data.from, data.quantity);
            }
        }
        else {
            eosio_assert(false, "Insufficient Authority: This transfer was not initiated by the user.");
        }
    }
    else if(sender == _self) {
        if(has_auth(_self)) {
            eosio_assert(data.from == _self, "This transfer was not initiated by this account.");
            // Verify simple memo
            if(data.memo == "tradestuff::withdrawal") {
                withdrawal(data.to, data.quantity);
            }
        }
        else {
            eosio_assert(false, "Insufficient Authority: This transfer was not initiated by this account.");
        }
    }
}

void tradestuff::deposit(account_name username, const eosio::asset& amount) {
    // check for valid quantity
    eosio_assert(amount.is_valid(), "Invalid deposit quantity.");
    eosio_assert(amount.amount > 0, "Must deposit positive quantity.");

    // find tradestuff account?
    account_index account(_self, _self);
    auto user_index = account.get_index<N(username)>();
    auto user_itr = user_index.find(username);

    eosio_assert(user_itr != user_index.end(), "No account found for this username.");
    auto itr = account.find(user_itr->id);
    eosio_assert(itr != account.end(), "Account not found by id.");

    // update table
    account.modify(itr, _self, [&](auto& acnt) {
        acnt.user_eos += amount;
        acnt.updated_at = eosio::time_point_sec(now());
    });
}

void tradestuff::withdrawal(account_name username, const eosio::asset& amount) {
    // validate quantity
    eosio_assert(amount.is_valid(), "Invalid withdrawal quantity.");
    eosio_assert(amount.amount > 0, "Must withdraw positive quantity");

    // find tradestuff account?
    account_index account(_self, _self);
    auto user_index = account.get_index<N(username)>();
    auto user_itr = user_index.find(username);

    eosio_assert(user_itr != user_index.end(), "No account found for this username.");
    auto itr = account.find(user_itr->id);
    eosio_assert(itr != account.end(), "Account not found by id.");
    eosio_assert(itr->user_eos >= amount, "Insufficient balance for withdrawal for this account.");

    // check liquidity of _self account
    // we could have too much staked to service this withdrawal
    token::accounts cur_account(N(eosio.token), _self);
    auto cur_itr = cur_account.find(amount.symbol.name());

    eosio_assert(cur_itr != cur_account.end(), "Could not find currency account.");
    eosio_assert(cur_itr->balance >= amount, "Not enough currency in liquidity pool.");

    account.modify(itr, _self, [&](auto& acnt) {
        acnt.user_eos -= amount;
        acnt.updated_at = eosio::time_point_sec(now());
    });
}