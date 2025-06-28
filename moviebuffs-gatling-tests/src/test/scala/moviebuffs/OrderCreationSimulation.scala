package moviebuffs

import io.gatling.core.Predef._
import io.gatling.core.feeder.BatchableFeederBuilder
import io.gatling.core.structure.{ChainBuilder, ScenarioBuilder}
import io.gatling.http.Predef._
import io.gatling.http.protocol.HttpProtocolBuilder

import scala.concurrent.duration._
import scala.language.postfixOps
import scala.util.Random

class OrderCreationSimulation extends Simulation {

  val httpConf: HttpProtocolBuilder = http
    .baseUrl("http://localhost:18080")
    .acceptHeader("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
    .doNotTrackHeader("1")
    .acceptLanguageHeader("en-US,en;q=0.5")
    .acceptEncodingHeader("gzip, deflate")
    .userAgentHeader("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:16.0) Gecko/20100101 Firefox/16.0")

  // Now, we can write the scenario as a composition
  val scnCreateOrder: ScenarioBuilder = scenario("Create Order").exec(Order.create).pause(2)

  setUp(
    scnCreateOrder.inject(rampUsers(500) during  (10 seconds))
      //,setUp(scn.inject(atOnceUsers(10)).protocols(httpConf))
  ).protocols(httpConf)
    .assertions(
      global.responseTime.max.lt(800),
      global.successfulRequests.percent.gt(95)
    )

}

object Order {
  val searchFeeder: BatchableFeederBuilder[String] = csv("data/search.csv").random
  val genreFeeder: BatchableFeederBuilder[String] = csv("data/genres.csv").random
  val productFeeder: BatchableFeederBuilder[String] = csv("data/products.csv").random

  val credentialsFeeder: BatchableFeederBuilder[String] = csv("data/credentials.csv").random
  var randomString: Iterator[Map[String, String]] = Iterator.continually(Map("randstring" -> Random.alphanumeric.take(20).mkString))
  var randomQuantity: Iterator[Map[String, Int]] = Iterator.continually(Map("randomQuantity" -> ( Random.nextInt(4) + 1 )))

  var token = ""
  val login: ChainBuilder = feed(credentialsFeeder)
    .exec(http("Login")
      .post("/api/auth/login")
      .body(StringBody(
        """
                    {
                      "username":"${username}",
                      "password":"${password}"
                    }
                  """)).asJson
      .check(status.is(200),jsonPath("$..access_token").saveAs("token"))
    )
    .exec(session => {
      token = session("token").as[String].trim
      session
    })
    .pause(1)

  val createOrder: ChainBuilder = feed(randomQuantity)
      .feed(productFeeder)
      .feed(randomString)
      .exec(
        http("Create Order").post("/api/orders")
          .header("Authorization", "Bearer ${token}")
          .body(ElFileBody("data/order.json")).asJson
      )
      .pause(1)

  val create: ChainBuilder =
    exec(login)
    .pause(2)
    .exec(createOrder)

}
