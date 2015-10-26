import java.awt.Color;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.elasticsearch.common.base.Objects;
import org.elasticsearch.common.collect.Ordering;

import com.google.common.base.Optional;
import com.google.common.base.Preconditions;
import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.HashMultiset;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Lists;
import com.google.common.collect.Multimap;
import com.google.common.collect.Multiset;

public class GuavaTest {

    /**
     * @param args
     * @throws Exception 
     */
    public static void main(String[] args) throws Exception {
        // TODO Auto-generated method stub
        int age;
        // System.out.println("user age:" + age);
        String name;
        // System.out.println("user name:" + name);
        Optional<Integer> possible = Optional.of(6);
        if (possible.isPresent()) {
            System.out.println("possible isPresent:" + possible.isPresent());
            System.out.println("possible value:" + possible.get());
            System.out.println("possible value:" + Optional.fromNullable(null));
        }
        Optional<Integer> possible2 = Optional.of(6);
        Optional<Integer> absentOpt = Optional.absent();
        Optional<Integer> NullableOpt = Optional.fromNullable(null);
        Optional<Integer> NoNullableOpt = Optional.fromNullable(10);
        if (possible2.isPresent()) {
            System.out.println("possible isPresent:" + possible2.isPresent());
            System.out.println("possible value:" + possible2.get());
        }
        if (absentOpt.isPresent()) {
            System.out.println("absentOpt isPresent:" + absentOpt.isPresent());
            ;
        }
        //System.out.println(NullableOpt.get());
        if (NullableOpt.isPresent()) {
            System.out.println("fromNullableOpt isPresent:" + NullableOpt.isPresent());
            ;
        }
        if (NoNullableOpt.isPresent()) {
            System.out.println("NoNullableOpt isPresent:" + NoNullableOpt.isPresent());
            ;
        }
        Optional<Long> valueNull = methodNull();
        if (valueNull.isPresent() == true) {
            System.out.println("获得返回值: " + valueNull.get());
        }
        else {

            System.out.println("获得返回值: " + valueNull.or(-12L));
        }
        System.out.println("获得返回值 orNull: " + valueNull.orNull());
        Optional<Long> valueNotNull = methodNotNull();
        if (valueNotNull.isPresent() == true) {
            Set<Long> set = valueNotNull.asSet();
            System.out.println("获得返回值 set 的 size : " + set.size());
            System.out.println("获得返回值: " + valueNotNull.get());
        }
        else {
            System.out.println("获得返回值: " + valueNotNull.or(-12L));
        }

        System.out.println("获得返回值 orNull: " + valueNotNull.orNull());
        getPersonByPrecedition(8, "peida");
        try {
            getPersonByPrecedition(-9, "a");
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }
        try {
            getPersonByPrecedition(8, "");
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }
        try {
            getPersonByPrecedition(8, "a");
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }
        try {
            getPersonByPrecedition(8, null);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }
        List<Integer> intList = new ArrayList<Integer>();
        for (int i = 0; i < 10; i++) {
            try {
                checkState(intList, 9);
                intList.add(i);
            }
            catch (Exception e) {
                System.out.println(e.getMessage());
            }

        }

        try {
            checkPositionIndex(intList, 3);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }

        try {
            checkPositionIndex(intList, 13);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }

        try {
            checkPositionIndexes(intList, 3, 7);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }

        try {
            checkPositionIndexes(intList, 3, 17);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }

        try {
            checkPositionIndexes(intList, 13, 17);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }

        try {
            checkElementIndex(intList, 6);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }

        try {
            checkElementIndex(intList, 16);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
        }

        // System.out.println(Objects.toStringHelper(this).add("x", 1).toString());
        System.out.println(Objects.toStringHelper(Person.class).add("x", 1).toString());

        Person person = new Person("peida", 23);

        String result = Objects.toStringHelper(Person.class)
                .add("name", person.name)
                .add("age", person.age).toString();
        System.out.print(result);
        System.out.println(Objects.toStringHelper(Person.class).add("name", person.name).add("age", 6));
        System.out.println(Objects.equal("a", "null"));
        System.out.println(Objects.equal(null, null));
        System.out.println(Objects.equal(new Person("a", 2), new Person("a", 2)));
        Person person2 = new Person("pedia", 23);
        System.out.println(Objects.equal(person, person2));
        Person person3 = person2;
        System.out.println(Objects.equal(person2, person3));
        System.out.println(Objects.hashCode("a"));
        System.out.println(Objects.hashCode("a"));
        System.out.println(Objects.hashCode("a", "b"));
        System.out.println(Objects.hashCode("b", "a"));
        //System.out.println(Objects.hashCode("ab"));
        System.out.println(Objects.hashCode("a", "b", "c"));
        System.out.println(Objects.hashCode(person));
        List<String> list = Lists.newArrayList();
        List<Integer> intlist = Lists.newArrayList();
        intlist.add(5);
        intlist.add(4);
        intlist.add(6);
        System.out.println(intlist);
        System.out.println();
        Ordering<Integer> natureOrdering = Ordering.natural();
        System.out.println("naturalOrdering:" + natureOrdering.sortedCopy(intlist));
        list.add("peida");
        list.add("jerry");
        list.add("harry");
        list.add("eva");
        list.add("jhon");
        list.add("neron");
        Ordering<Object> usingtoStringOrdering = Ordering.usingToString();
        System.out.println("list:" + list);
        System.out.println(usingtoStringOrdering.sortedCopy(list));
        Ordering<Object> arbiOrdering = Ordering.arbitrary();
        System.out.println(arbiOrdering.sortedCopy(list));

        ImmutableList<String> immutableList = ImmutableList.copyOf(list);
        System.out.println("ImmuList " + immutableList);
        list.add("add");
        System.out.println(list);
        System.out.println(immutableList);
        ImmutableSet<String> immutableSet = ImmutableSet.of("a", "d", "c");
        System.out.println(immutableSet);
        ImmutableSet<Color> imColorSet =
                ImmutableSet.<Color> builder()
                        .add(new Color(0, 255, 255))
                        .add(new Color(0, 191, 255))
                        .build();
        ImmutableSet<Person> immutableSetPerson = ImmutableSet.<Person> builder().add(new Person("a", 5)).add(
                new Person("b", 6)).build();
        System.out.println("imColorSet:" + imColorSet);
        System.out.println(immutableSetPerson);
        String strWorld = "wer|dfd||dd||dfd|dda|de|dr";
        String[] words = strWorld.split("\\|");
        List<String> wordList = new ArrayList<String>();
        for (String word : words) {
            wordList.add(word);
        }
        Multiset<String> wordsMultiset = HashMultiset.create();
        wordsMultiset.addAll(wordList);

        for (String key : wordsMultiset.elementSet()) {
            System.out.println(key + " count：" + wordsMultiset.count(key));
        }
        String wordString = "werel|re|rewr|re|re|ra|gr|v|d";
        String[] wordStrings = wordString.split("\\|");
        List<String> wordList2 = new ArrayList<String>();
        for (String word : wordStrings) {
            wordList2.add(word);
        }
        Multiset<String> wordMultiset = HashMultiset.create();
        wordMultiset.addAll(wordList2);
        for (String key : wordMultiset.elementSet()) {
            System.out.println(key + " count：" + wordMultiset.count(key));
        }
        Multimap<String, StudentScore> scoreMultimap = ArrayListMultimap.create();
        for (int i = 10; i < 20; i++) {
            StudentScore studentScore = new StudentScore();
            studentScore.CourseId = 1001 + i;
            studentScore.score = 100 - i;
            scoreMultimap.put("peida", studentScore);
        }
        System.out.println("--_--");
        for (StudentScore studentScore : scoreMultimap.values()) {
            System.out.println(studentScore.CourseId + " - " + studentScore.score);
        }
        System.out.println("scoreMultimap:" + scoreMultimap.size());
        System.out.println("scoreMultimap:" + scoreMultimap.keys());
        Multimap<String, StudentScore> scoreMultimap1 = ArrayListMultimap.create();
        for (int i = 10; i < 20; i++) {
            StudentScore studentScore = new StudentScore();
            studentScore.CourseId = 1001 + i;
            studentScore.score = 100 - i;
            scoreMultimap1.put("peida", studentScore);
        }
        System.out.println("scoreMultimap:" + scoreMultimap1.size());
        System.out.println("scoreMultimap:" + scoreMultimap1.keys());

        Collection<StudentScore> studentScore = scoreMultimap1.get("peida");
        StudentScore studentScore1 = new StudentScore();
        studentScore1.CourseId = 1034;
        studentScore1.score = 67;
        studentScore.add(studentScore1);

        StudentScore studentScore2 = new StudentScore();
        studentScore2.CourseId = 1045;
        studentScore2.score = 56;
        scoreMultimap1.put("jerry", studentScore2);

        System.out.println("scoreMultimap:" + scoreMultimap1.size());
        System.out.println("scoreMultimap:" + scoreMultimap1.keys());

        for (StudentScore stuScore : scoreMultimap1.values()) {
            System.out.println("stuScore one:" + stuScore.CourseId + " score:" + stuScore.score);
        }

        scoreMultimap1.remove("jerry", studentScore2);
        System.out.println("scoreMultimap:" + scoreMultimap1.size());
        System.out.println("scoreMultimap:" + scoreMultimap1.get("jerry"));

        scoreMultimap1.put("harry", studentScore2);
        scoreMultimap1.removeAll("harry");
        System.out.println("scoreMultimap:  " + scoreMultimap1.size());
        System.out.println("scoreMultimap:" + scoreMultimap1.get("harry"));
    }

    private static Optional<Long> methodNull() {
        return Optional.fromNullable(null);
    }

    private static Optional<Long> methodNotNull() {
        return Optional.fromNullable(16L);
    }

    private static void getPersonByPrecedition(int age, String name) throws Exception {
        Preconditions.checkNotNull(name, "name 不为空 ");
        Preconditions.checkArgument(age > 0, "age 大于0");
        Preconditions.checkArgument(name.length() > 0, "neme为\'\'");
        System.out.println(age + "  " + name);
    }

    public static void checkState(List<Integer> intList, int index) throws Exception {
        //表达式为true不抛异常
        Preconditions.checkState(intList.size() < index, " intList size 不能大于" + index);
    }

    public static void checkPositionIndex(List<Integer> intList, int index) throws Exception {
        Preconditions.checkPositionIndex(index, intList.size(), "index " + index + " 不在 list中， List size为："
                + intList.size());
    }

    public static void checkPositionIndexes(List<Integer> intList, int start, int end) throws Exception {
        Preconditions.checkPositionIndexes(start, end, intList.size());
    }

    public static void checkElementIndex(List<Integer> intList, int index) throws Exception {
        Preconditions.checkElementIndex(index, intList.size(), "index 为 " + index + " 不在 list中， List size为： "
                + intList.size());
    }

}

class Person {
    public String name;
    public int age;

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

class StudentScore {
    int CourseId;
    int score;
}