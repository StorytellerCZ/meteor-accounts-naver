import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

Template.configureLoginServiceDialogForNaver.helpers({
  siteUrl: () => Meteor.absoluteUrl(),
})

Template.configureLoginServiceDialogForNaver.fields = () => [
  { property: 'clientId', label: 'Client ID' },
  { property: 'secret', label: 'Client Secret' },
]
