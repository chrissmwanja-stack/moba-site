# Gallery category-first upload controls

Extract this ZIP into the root of your existing moba-site repository.

In Admin → Website content → Gallery photos, the old “Add photo” action is now “Add category”. Existing photo categories are available in a selector, so choose one and upload into it. “Add category” opens a new-category field; its category is added to the selector after the first photos are uploaded. No database migration is required.

After extraction, run `npm run build`, commit and push, then redeploy.
