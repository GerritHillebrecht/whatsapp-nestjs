import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from '@user/entity';
import { ContactService } from '@whatsapp/service';

@Resolver()
export class ContactQueryResolver {
  constructor(private contact: ContactService) {}

  @Query(() => [User])
  contacts(@Args('id') id: number) {
    return this.contact.getContacts(id);
  }

  @Query(() => [User])
  searchContacts(@Args('searchString') searchString: string) {
    return this.contact.searchContacts(searchString);
  }
}
