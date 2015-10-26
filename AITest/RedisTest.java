import java.util.Map;

import redis.clients.jedis.Jedis;

import com.google.common.base.Optional;
import com.google.common.collect.Maps;

public class RedisTest {
    public static void main(String[] args) {
        //连接本地的 Redis 服务
        /*RedisUtils redis = RedisUtils.getInstance();
        Jedis jedis2 = redis.getJedis();
        //redis.releaseConn(jedis2);
        jedis2.set("name", "jedis2");
        System.out.println(jedis2.get("name"));*/
        Jedis jedis = new Jedis("10.40.32.15");
        System.out.println("Connection to server sucessfully");

        //存储数据到列表中
        /*jedis.lpush("tutorial-list", "Redis");
        jedis.lpush("tutorial-list", "Mongodb");
        jedis.lpush("tutorial-list", "Mysql");
        jedis.set("name", "first value");*/
        /* jedis.append("name", "test2");
         System.out.println(jedis.get("name"));
         jedis.del("name");
         System.out.println(jedis.get("name"));*/
        //System.out.println("判断name是否存在" + jedis.exists("name") + "判断tutorial是否存在" + jedis.exists("tutorial-list"));
        /*jedis.set("name2", "valuename2");
        jedis.set("name3", "valuename3");*/

        /*Set<String> keys = jedis.keys("*");
        Iterator<String> it = keys.iterator();
        while (it.hasNext()) {
            String key = it.next();
            System.out.println("key " + key + " value :" + jedis.get(key));
        }*/
        // 获取存储的数据并输出
        /* List<String> list = jedis.lrange("tutorial-list", 0, 20);
         for (int i = 0; i < list.size(); i++) {
             System.out.println("Stored string in redis: " + i + " : " + list.get(i));
         }
         //jedis.flushDB();
         System.out.println(jedis.get("name"));
         System.out.println("设置key为name过期时间为 5秒 " + jedis.expire("name", 5));
         try {
             Thread.sleep(2000);
         }
         catch (Exception e) {
             // TODO: handle exception
         }*/
        /*System.out.println("name的剩余时间 " + jedis.ttl("name"));
        System.out.println("name生存时间 " + jedis.persist("name"));
        System.out.println("name存储类型" + jedis.type("name"));
        System.out.println("设置多个值" + jedis.mset("key01", "key01v", "key02", "key02v"));
        System.out.println("获取多个值" + jedis.mget("key01", "key02"));*/
        /*System.out.println("原先key301不存在时，新增key301：" + jedis.setnx("key301", "value301"));
        System.out.println("原先key302不存在时，新增key302：" + jedis.setnx("key302", "value302"));
        System.out.println("当key302存在时，尝试新增key302：" + jedis.setnx("key302", "value302_new"));*/

        /*System.out.println("新增key03，设置时间为2秒" + jedis.setex("key03", 2, "key03v"));
        System.out.println("key03的值" + jedis.get("key03"));
        try {
            Thread.sleep(3000);
        }
        catch (Exception e) {
            // TODO: handle exception
        }
         System.out.println("3秒后key03的值 " + jedis.get("key03"));

         System.out.println("获取key02的值并更新 " + jedis.getSet("key02", "new key 02 v"));
         System.out.println(jedis.get("key02"));*/
        /*
                System.out.println("所有元素-tutorial-list：" + jedis.lrange("tutorial-list", 0, -1));
                //System.out.println(jedis.lrem("tutorial-list", 2, "Mysql"));

                //System.out.println(jedis.ltrim("tutorial-list", 0, 3));
                //System.out.println(jedis.lpop("tutorial-list"));
                // System.out.println(jedis.lset("tutorial-list", 0, "New Value"));
                System.out.println("所有元素-tutorial-list：" + jedis.lrange("tutorial-list", 0, -1));
                System.out.println(jedis.llen("tutorial-list"));
                SortingParams sp = new SortingParams();
                sp.alpha();
                sp.limit(0, 2);

                System.out.println("返回排序后的结果" + jedis.sort("tutorial-list", sp));
                //System.out.println("返回排序后的结果：" + jedis.sort("tutorial-list"));
                System.out.println("  " + jedis.lindex("tutorial-list", 1));*/

        //System.out.println(jedis.sadd("sets", "set1"));
        //jedis.sadd("sets", "sets");
        /*jedis.sadd("sets", "abc");
        jedis.sadd("sets", "bca");
        jedis.sadd("sets", "cba");
        jedis.sadd("sets", "adb");
        jedis.sadd("sets", "xyz");
        jedis.sadd("sets", "opq");*/
        /*System.out.println(jedis.smembers("sets"));
        System.out.println(jedis.srem("sets", "abc"));
        System.out.println(jedis.smembers("sets"));
        System.out.println(jedis.sismember("sets", "adb"));
        System.out.println();
        Set<String> set = jedis.smembers("sets");
        Iterator<String> it = set.iterator();
        while (it.hasNext()) {
            Object obj = it.next();
            System.out.println(obj);
        }
        System.out.println();
        */
        /*     System.out.println("zset中添加元素element001：" + jedis.zadd("zset", 7.0, "element001"));
             System.out.println("zset中添加元素element002：" + jedis.zadd("zset", 8.0, "element002"));
             System.out.println("zset中添加元素element003：" + jedis.zadd("zset", 2.0, "element003"));
             System.out.println("zset中添加元素element004：" + jedis.zadd("zset", 3.0, "element004"));
             System.out.println(" " + jedis.zadd("zset", 5, "element005"));*/
        /*System.out.println("zset集合中的所有元素：" + jedis.zrange("zset", 0, -1));//按照权重值排序
        System.out.println(jedis.zrem("zset", "element003"));
        System.out.println("zset集合中的所有元素：" + jedis.zrange("zset", 0, -1));
        System.out.println(jedis.zcount("zset", 2.0, 7.0));
        System.out.println(jedis.zcard("zset"));*/
        jedis.hset("hashs", "hkey001", "hkeyV001");
        jedis.hset("hashs", "hkey002", "hkeyV003");
        jedis.hset("hashs", "hkey003", "hkeyV002");
        jedis.hset("hashs", "hkey004", "hkeyV041");
        jedis.hincrBy("hashs", "hkey005", 53);
        System.out.println(jedis.hvals("hashs"));
        System.out.println(jedis.hexists("hashs", "hkey006"));
        System.out.println(jedis.hget("hashs", "hkey004"));
        System.out.println(jedis.hkeys("hashs"));
        jedis.quit();
        Optional<Integer> possible = Optional.of(5);
        possible.isPresent(); // returns true
        Map<String, Map<String, String>> map = Maps.newHashMap();
        System.out.println(possible.get()); // returns 5
    }
}
