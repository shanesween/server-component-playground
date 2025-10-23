'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

const nameSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
});

const teamSchema = z.object({
    favoriteTeams: z.array(z.string()).min(1, 'Please select at least one team'),
});

type NameFormValues = z.infer<typeof nameSchema>;
type TeamFormValues = z.infer<typeof teamSchema>;

interface NFLTeam {
    id: number;
    name: string;
    city: string;
    fullName: string;
    abbreviation: string;
    primaryColor: string;
    secondaryColor: string;
    conference: string;
    division: string;
}

export default function OnboardingPage() {
    const router = useRouter();
    const { user, loading } = useRequireAuth();
    const [step, setStep] = useState<'welcome' | 'name' | 'teams'>('welcome');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
    const [nflTeams, setNflTeams] = useState<NFLTeam[]>([]);
    const [firstName, setFirstName] = useState('');

    const nameForm = useForm<NameFormValues>({
        resolver: zodResolver(nameSchema),
        defaultValues: {
            firstName: '',
        },
    });

    const teamForm = useForm<TeamFormValues>({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            favoriteTeams: [],
        },
    });

    // Fetch NFL teams on component mount
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch('/api/seed/nfl-teams');
                const data = await response.json();
                if (data.success) {
                    setNflTeams(data.teams);
                }
            } catch (error) {
                console.error('Error fetching NFL teams:', error);
            }
        };
        fetchTeams();
    }, []);

    const onNameSubmit = async (values: NameFormValues) => {
        setFirstName(values.firstName);
        setStep('teams');
    };

    const onTeamSubmit = async (values: TeamFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            // Save favorite teams
            const response = await fetch('/api/onboarding/teams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    teamIds: selectedTeams,
                }),
            });

            if (response.ok) {
                // Mark onboarding as completed
                await fetch('/api/onboarding/complete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: firstName,
                    }),
                });

                router.push('/');
            } else {
                setError('Failed to save favorite teams');
            }
        } catch (error) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTeam = (teamId: number) => {
        setSelectedTeams(prev =>
            prev.includes(teamId)
                ? prev.filter(id => id !== teamId)
                : [...prev, teamId]
        );
    };

    const getStepProgress = () => {
        switch (step) {
            case 'welcome': return 1;
            case 'name': return 2;
            case 'teams': return 3;
            default: return 1;
        }
    };

    const getStepTitle = () => {
        switch (step) {
            case 'welcome': return 'Welcome to Strictly Sports!';
            case 'name': return 'What\'s your name?';
            case 'teams': return 'Choose your favorite teams';
            default: return '';
        }
    };

    const getStepDescription = () => {
        switch (step) {
            case 'welcome': return 'Let\'s get you set up with personalized sports updates';
            case 'name': return 'We\'ll use this to personalize your experience';
            case 'teams': return 'Select your favorite NFL teams to get updates';
            default: return '';
        }
    };

    // Group teams by division
    const groupedTeams = nflTeams.reduce((acc, team) => {
        const key = `${team.conference} ${team.division}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(team);
        return acc;
    }, {} as Record<string, NFLTeam[]>);

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="max-w-4xl w-full mx-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center space-x-4">
                            {[1, 2, 3].map((stepNumber) => (
                                <div key={stepNumber} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        stepNumber <= getStepProgress()
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white/20 text-white/50'
                                    }`}>
                                        {stepNumber < getStepProgress() ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            stepNumber
                                        )}
                                    </div>
                                    {stepNumber < 3 && (
                                        <div className={`w-8 h-0.5 mx-2 ${
                                            stepNumber < getStepProgress()
                                                ? 'bg-blue-500'
                                                : 'bg-white/20'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-white font-bold text-2xl">S</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {getStepTitle()}
                        </h1>
                        <p className="text-white/70 text-lg">
                            {getStepDescription()}
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert className="mb-6 border-red-500/50 bg-red-500/10">
                            <AlertDescription className="text-red-200">{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Welcome Step */}
                    {step === 'welcome' && (
                        <div className="text-center space-y-6">
                            <div className="space-y-4">
                                <div className="text-6xl">🏈</div>
                                <h2 className="text-2xl font-semibold text-white">
                                    Get ready for the ultimate sports experience!
                                </h2>
                                <p className="text-white/70 text-lg">
                                    We'll personalize your feed with your favorite teams and keep you updated with the latest scores, news, and highlights.
                                </p>
                            </div>
                            <Button
                                onClick={() => setStep('name')}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-3"
                            >
                                Let's Get Started
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    )}

                    {/* Name Step */}
                    {step === 'name' && (
                        <Form {...nameForm}>
                            <form onSubmit={nameForm.handleSubmit(onNameSubmit)} className="space-y-6">
                                <FormField
                                    control={nameForm.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white text-lg">First Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter your first name"
                                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-lg py-3"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex space-x-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                                        onClick={() => setStep('welcome')}
                                    >
                                            <ArrowLeft className="mr-2 w-4 h-4" />
                                            Back
                                        </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                        disabled={!nameForm.watch('firstName')}
                                    >
                                        Continue
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}

                    {/* Teams Step */}
                    {step === 'teams' && (
                        <div className="space-y-6">
                            <div className="space-y-6">
                                {Object.entries(groupedTeams).map(([division, teams]) => (
                                    <div key={division} className="space-y-3">
                                        <h3 className="text-white font-semibold text-lg border-b border-white/20 pb-2">
                                            {division}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {teams.map((team) => (
                                                <Card
                                                    key={team.id}
                                                    className={`cursor-pointer transition-all duration-200 ${
                                                        selectedTeams.includes(team.id)
                                                            ? 'bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/20'
                                                            : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                                                    }`}
                                                    onClick={() => toggleTeam(team.id)}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center space-x-3">
                                                            <Checkbox
                                                                checked={selectedTeams.includes(team.id)}
                                                                className="data-[state=checked]:bg-blue-500"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="text-white font-medium">
                                                                        {team.fullName}
                                                                    </h4>
                                                                    <Badge 
                                                                        variant="secondary" 
                                                                        className="bg-white/20 text-white text-xs"
                                                                    >
                                                                        {team.abbreviation}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                                    onClick={() => setStep('name')}
                                >
                                    <ArrowLeft className="mr-2 w-4 h-4" />
                                    Back
                                </Button>
                                <Button
                                    onClick={() => {
                                        teamForm.setValue('favoriteTeams', selectedTeams.map(String));
                                        teamForm.handleSubmit(onTeamSubmit)();
                                    }}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                    disabled={isLoading || selectedTeams.length === 0}
                                >
                                    {isLoading ? (
                                        'Setting up...'
                                    ) : (
                                        <>
                                            Go To App
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            </div>

                            {selectedTeams.length > 0 && (
                                <p className="text-white/70 text-center">
                                    {selectedTeams.length} team{selectedTeams.length !== 1 ? 's' : ''} selected
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}