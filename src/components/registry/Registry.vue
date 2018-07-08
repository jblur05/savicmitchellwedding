<template>
    <v-container grid-list-md >
        <v-layout row justify-center >
            <v-flex xs12>
                <v-card class="opaque">
                    <v-container fill-height fluid>
                        <v-layout fill-height>
                          <v-flex xs12 align-end flexbox>
                            <span class="display-2 tangerine-font-bold">Registry</span>
                          </v-flex>
                        </v-layout>
                      </v-container>
                <v-card-title>
                  <v-container text-xs-center>
                    <span>Because we've been out of the nest for so long, we decided on an alternative to a traditional registry, the honeymoon fund! Please feel free to visit our fund using the link below.  </span><br/>
                    <br/>
                    <span>We are so excited to have our friends and family join us on our special day!</span><br/>
                    <span></span><br/>
                  </v-container>
                </v-card-title>
                <v-card-actions>
                  <v-btn flat color="pink lighten-3" target="_blank" href="https://www.theknot.com/us/indira-savic-mitchell-and-james-mitchell-aug-2018/registry#newly-wed">Honey Moon Fund</v-btn>
                </v-card-actions>
                </v-card>
            </v-flex>
            <v-flex xs10>
                <v-card height="100%" href="https://www.theknot.com/us/indira-savic-mitchell-and-james-mitchell-aug-2018/registry#newly-wed">
                    <v-card-media
                      class="white--text"
                      height="100%"
                      src="/static/imgs/beach.jpg"
                    >
                    </v-card-media>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
