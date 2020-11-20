import { NgModule } from '@angular/core';
import { FriendPipe } from '../pipes/friend';
import { ConversationPipe } from '../pipes/conversation';
import { GroupPipe } from '../pipes/group';
import { SearchPipe } from '../pipes/search';
import { DateFormatPipe } from '../pipes/date';


@NgModule({
    imports: [
    ],
    declarations: [
        FriendPipe,
        ConversationPipe,
        GroupPipe,
        SearchPipe,
        DateFormatPipe
    ],
    exports: [
        FriendPipe,
        ConversationPipe,
        GroupPipe,
        SearchPipe,
        DateFormatPipe
    ]
})

export class SharedModule { }