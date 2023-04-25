// *Design Imports*
import {
  Popover,
  PopoverTrigger,
  Link,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Heading,
  UnorderedList,
  ListItem,
  Divider,
} from "@chakra-ui/react";

const ChangeLog = () => {
  return (
    <Popover m="0 !important">
      <PopoverTrigger m="0 !important">
        <Link variant="simple">Davy Blackjack v1.0.6</Link>
      </PopoverTrigger>
      <PopoverContent bgColor="bd700" maxH="500px" overflowY="scroll">
        <PopoverCloseButton color="dwordMain" />
        <PopoverHeader textDecoration="underline" borderColor="borderD">
          Change Log
        </PopoverHeader>
        <PopoverBody>
          <Heading textAlign="center" fontSize="24px" lineHeight="1.2" mb="4px">
            v1.0.6
          </Heading>
          <UnorderedList fontSize="14px">
            <ListItem>
              Resets dealerViewWidthOnMoreCards state properly now; it did only
              reset on Match mode.
            </ListItem>
            <ListItem>
              Fixed when you have no cash to double. It used to just not render
              the button when you have no cash to double, but that cause some
              unnecessary re-renders because of changing the DOM and caused, for
              example, the natural checks to not work right. Now the double
              button just gets disabled and not takin out of the dom on an
              condition.
            </ListItem>
            <ListItem>
              Fixed when changing modes that it just resets the game on no
              condition. If you change the mode and you're losing in Match mode,
              it would be cheating. So, changing the modes is changed around now
              and it doesn't let you change the mode when a game is playing in
              Match mode.
            </ListItem>
            <ListItem>
              Fixed how the score didn't update when the player gets an Ace as
              the first card.
            </ListItem>
          </UnorderedList>
          <Divider m="0.5rem 0" />
          <Heading textAlign="center" fontSize="24px" lineHeight="1.2" mb="4px">
            v1.0.2
          </Heading>
          <UnorderedList fontSize="14px">
            <ListItem>
              Fixed the position of the dealer's standing text.
            </ListItem>
            <ListItem>
              Fixed the duration of the exit animation for the cards, it was too
              slow.
            </ListItem>
          </UnorderedList>
          <Divider m="0.5rem 0" />
          <Heading textAlign="center" fontSize="24px" lineHeight="1.2" mb="4px">
            v1.0.0
          </Heading>
          <UnorderedList fontSize="14px">
            <ListItem>Adds animations.</ListItem>
            <ListItem>
              When the dealer deals, the cards are displayed in the order they
              are dealt.
            </ListItem>
            <ListItem>
              Adds 3 sound variations when given cards for the player and the
              dealer.
            </ListItem>
            <ListItem>More responsive, so mobile devices can play.</ListItem>
            <ListItem>
              More options for the dropdown and has been refactored.
            </ListItem>
            <ListItem>
              Had to fix when the dealer gets a natural regarding how the
              showAcePrompt useEffect ran at the same time as the naturals
              useEffect.
            </ListItem>
            <ListItem>
              Fixes when the player bets and has a balance of 0 after the bet;
              couldn't play because the buttons gets disabled if the balance is
              falsy, now everything checks if the balance is null.
            </ListItem>
          </UnorderedList>
          <Divider m="0.5rem 0" />
          <Heading textAlign="center" fontSize="24px" lineHeight="1.2" mb="4px">
            v1.1.5-alpha
          </Heading>
          <UnorderedList fontSize="14px">
            <ListItem>
              Fixed missing dependency in determine winner useEffect and added
              clean-up functions; The game now determines the winner when both
              are standing.
            </ListItem>
            <ListItem>
              Implements new redux state, streak, to keep track of the player's
              wins in a row for "On a Role" quest and adds "Beginner's Luck"
              quest.
            </ListItem>
            <ListItem>
              Changes regarding how the completedQuests state and wallet state
              is handled is not in redux anymore and used in the authContext
              now, so changes was made how the balance is handled.
            </ListItem>
            <ListItem>Fixed hamburger menu animation.</ListItem>
          </UnorderedList>
          <Divider m="0.5rem 0" />
          <Heading textAlign="center" fontSize="24px" lineHeight="1.2" mb="4px">
            v1.0.2-alpha
          </Heading>
          <UnorderedList fontSize="14px">
            <ListItem>
              Fixes how blackjack was played entirely. Was a stupid mistake, in
              blackjack the dealer waits for the player to finish (if the player
              gets blackjack, stands or bust). The way I had it, the dealers
              turn ran when the player makes their first decision (if the player
              hit or stand). But now Davy Blackjack works like blackjack should.
            </ListItem>
            <ListItem>
              When the player gets a blackjack, the dealer now keeps doing their
              turn until a blackjack or a bust before determining the winner.
            </ListItem>
          </UnorderedList>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ChangeLog;
